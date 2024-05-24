import express from 'express';
import multer from 'multer';
import stream from 'stream'; 
import { ObjectId } from 'mongodb';
import { GridFSBucket } from 'mongodb';
import { authenticateToken } from '../settings/authenticationMiddleware.js';
import { connectToDatabase } from '../settings/database.js';

const photo = express.Router();

// Loggers
import { getLoggerInstance } from '../settings/logger.js';
const logger = getLoggerInstance();

// Connect to the database
const db = await connectToDatabase();
const galleriesCollection = db.collection('galleries');
const photoCollection = db.collection('photos.chunks');

// Set up multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload single phooto to gallery
photo.post('/:galleryId', authenticateToken, upload.single('photo'), async (req, res) => {
    const galleryId = req.params.galleryId; 

    if (!galleryId) {
        res.status(400).send('No gallery ID provided.');
        return;
    }

    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    try {
        // Convert galleryId to ObjectId     
        const objectId = new ObjectId(galleryId);

        // Find the gallery in the database
        const gallery = await galleriesCollection.findOne({ _id: objectId });

        if (!gallery) {
            return res.status(404).json({ error: 'Gallery not found' });
        }

        const photoId = await uploadPhoto(db, req.file);

        // Create photo object to be added to the gallery
        const photoEntry = {
            content: req.file.originalname,
            showPortal: true, // Assuming default to true, this can be adjusted as needed
            photo_id: photoId
        };

        // Add photo to the gallery's photo array
        await galleriesCollection.updateOne(
            { _id: objectId },
            { $push: { photos: photoEntry } }
        );

        res.status(200).json({ photoId: photoId, message: "Upload successful!" });
    } catch (error) {
        logger.error('Error uploading photo:', error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to upload a photo to GridFS
async function uploadPhoto(db, file) {
    const bucket = new GridFSBucket(db, { bucketName: 'photos' });

    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.originalname);
        
        // Use a buffer to stream the file to GridFS
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream)
            .on('error', reject)
            .on('finish', () => {
                logger.info(`Uploaded ${file.originalname} to GridFS`);
                resolve(uploadStream.id); // Resolve with the file ID
            });
    });
}

// Get all photos in a specific gallery
// It will return a list of photo objects with the photo_id and a URL to the image
photo.get('/:galleryId', authenticateToken, async (req, res) => {
    const galleryId = req.params.galleryId;

    if (!galleryId) {
        res.status(400).send('No gallery ID provided.');
        return;
    }

    try {
        const objectId = new ObjectId(galleryId);

        const gallery = await galleriesCollection.findOne({ _id: objectId }, {
            projection: { photos: 1 }
        });

        if (!gallery) {
            return res.status(404).json({ error: 'Gallery not found' });
        }

        const photosWithUrls = gallery.photos.map(photo => ({
            ...photo,
            imageUrl: `https://${req.headers.host}/gallery/photo/${photo.photo_id}/image` 
        }));

        res.status(200).json({ photos: photosWithUrls });
    } catch (error) {
        logger.error('Error retrieving gallery:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get photo URL by photo ID
photo.get('/:photoId/image', async (req, res) => {
    const fileId = req.params.photoId;
    const bucket = new GridFSBucket(db, { bucketName: 'photos' });

    try {
        const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('error', () => {
            res.sendStatus(404);
        });

        downloadStream.on('end', () => {
            res.end();
        });

    } catch (error) {
        logger.error('Error serving file:', error);
        res.status(500).send('Internal server error');
    }
});

// Update photo if it should be shown in the portal
photo.patch('/:galleryId/:photoId', authenticateToken, async (req, res) => {
    const { galleryId, photoId } = req.params;
    const { showPortal } = req.body;
  
    try {
      const photoObjectId = new ObjectId(photoId);
      const galleryObjectId = new ObjectId(galleryId);

      const updated = await galleriesCollection.updateOne(
        { _id: galleryObjectId, "photos.photo_id": photoObjectId },
        { $set: { "photos.$.showPortal": showPortal } }
      );
  
      if (updated.modifiedCount === 0) {
        res.status(404).json({ message: 'Photo or gallery not found or no update needed' });
      } else {
        res.status(200).json({ message: 'Photo updated successfully' });
      }
    } catch (error) {
        logger.error('Error updating photo:', error);
      res.status(500).json({ error: error.message });
    }
});

// Delete photo from gallery
photo.delete('/:galleryId/:photoId', authenticateToken, async (req, res) => {
    const { galleryId, photoId } = req.params;

    try {
        const galleryObjectId = new ObjectId(galleryId);
        const photoObjectId = new ObjectId(photoId);

        // Pull the photo from the photos array in the specified gallery
        const updated = await galleriesCollection.updateOne(
            { _id: galleryObjectId },
            { $pull: { photos: { photo_id: photoObjectId } } }
        );

        if (updated.modifiedCount === 0) {
            return res.status(404).json({ message: 'Photo not found or gallery not found' });
        }

        // // Optionally delete the photo from GridFS if it's no longer needed
        // const db = req.app.locals.db; // Ensure db is available through app.locals or other means
        const bucket = new GridFSBucket(db, { bucketName: 'photos' });
        await bucket.delete(photoObjectId);

        res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
        logger.error('Error deleting photo:', error);
        res.status(500).json({ error: error.message });
    }
});

export default photo;
