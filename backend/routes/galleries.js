import express from 'express';
import { ObjectId } from 'mongodb';
import { authenticateToken } from '../settings/authenticationMiddleware.js';
import Gallery from '../model/gallery.js';
import { getLoggerInstance } from '../settings/logger.js';
const gallery = express.Router();

// Loggers
const logger = getLoggerInstance();

// Connect to the database
import { connectToDatabase } from '../settings/database.js';
const db = await connectToDatabase();
const galleriesCollection = db.collection('galleries');

// Get all galleries
gallery.get('/', authenticateToken,async (req, res) => {
    try {
        const allGalleries = await galleriesCollection.find({active: true}).toArray();
        res.status(200).json(allGalleries);
    } catch (error) {
        logger.error('Error fetching galleries:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create a gallery
gallery.post('/', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        // Create a new instance of the gallery
        const galleryCreation = new Gallery(name);
        await galleriesCollection.insertOne(galleryCreation);

        res.status(201).json({ message: 'Gallery created successfully', gallery: galleryCreation });
    } catch (error) {
        logger.error('Error creating user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete an existing gallery
gallery.delete('/:galleryId', authenticateToken, async (req, res) => {
    try {
        const galleryId = req.params.galleryId;

        // Convert galleryId to ObjectId     
        const objectId = new ObjectId(galleryId);

        // Find the gallery in the database
        const originalObject = await galleriesCollection.findOne({ _id: objectId });

        if (!originalObject) {
            return res.status(404).json({ error: 'Gallery not found' });
        }
                
        // Update the gallery in the database
        await galleriesCollection.updateOne(
            { _id: objectId },
            { $set: {"active":false} },
            { returnOriginal: false }
        );

        res.json({ message: 'Gallery deleted successfully' });

    } catch (error) {
        logger.error('Error deleting gallery:', error);
        res.status(500).json({ error: error.message });
    }
});

export default gallery;