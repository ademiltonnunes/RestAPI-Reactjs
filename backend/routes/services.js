import express from 'express';
import { connectToDatabase } from '../settings/database.js';

const services = express.Router();

// Loggers
import { getLoggerInstance } from '../settings/logger.js';
const logger = getLoggerInstance();

// Connect to the database
const db = await connectToDatabase();
const galleriesCollection = db.collection('galleries');

// Get all photos that should be shown service menu
services.get('/', async (req, res) => {
    try {
        const galleries = await galleriesCollection.aggregate([
            {
                $match: { active: true }
            },
            {
                $unwind: "$photos"
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    date: 1,
                    active: 1,
                    photos: {
                        content: "$photos.content",
                        photo_id: "$photos.photo_id",
                        imageUrl: { 
                            $concat: [
                                "https://",
                                { $toString: req.headers.host },
                                "/gallery/photo/",
                                { $toString: "$photos.photo_id" },
                                "/image"
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {  date: "$date", name: "$name"},
                    photos: { $push: "$photos" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id.name",
                    date: "$_id.date",
                    photos: 1
                }
            }
        ]).toArray();

        res.status(200).json(galleries);
    } catch (error) {
        logger.error('Error retrieving photos:', error);
        res.status(500).json({ error: error.message });
    }
});

export default services;