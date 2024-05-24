import express from 'express';
import { connectToDatabase } from '../settings/database.js';

const photo_portal = express.Router();

// Loggers
import { getLoggerInstance } from '../settings/logger.js';
const logger = getLoggerInstance();

// Connect to the database
const db = await connectToDatabase();
const galleriesCollection = db.collection('galleries');

// Get all photos that should be shown in the portal
photo_portal.get('/photos', async (req, res) => {

    try{
        const photos = await galleriesCollection.aggregate([
            {
            $match: { active: true }
            },
            {
            $unwind: "$photos"
            },
            {
            $match: {
                "photos.showPortal": true
            }
            },
            {
            $project: { 
                _id: 0,
                content: "$photos.content",
                photo_id: "$photos.photo_id",
                imageUrl: { $concat: ["https://",{ $toString: req.headers.host }, "/gallery/photo/", { $toString: "$photos.photo_id" }, "/image"] }
            }
            }
        ]).toArray();
    
    
        res.status(200).json({ photos: photos });
    }catch (error) {
        logger.error('Error retrieving portal photos:', error);
        res.status(500).json({ error: error.message });
    }
   
});

export default photo_portal;