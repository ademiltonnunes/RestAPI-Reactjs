import express from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import UserCreate from '../model/userCreate.js';
import UserUpdate from '../model/userUpdate.js';
import { authenticateToken } from '../settings/authenticationMiddleware.js';
const user = express.Router();

// Loggers
import { getLoggerInstance } from '../settings/logger.js';
const logger = getLoggerInstance();

// Connect to the database
import { connectToDatabase } from '../settings/database.js';
const db = await connectToDatabase();
const usersCollection = db.collection('users');

// Create a new user
user.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if a user with the same username or email already exists
        const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new instance of the UserCreate
        const userCreation = new UserCreate(username, email, hashedPassword);
        await usersCollection.insertOne(userCreation);

        res.status(201).json({ message: 'User created successfully', user: userCreation });
    } catch (error) {
        logger.error('Error creating user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all users
user.get('/', authenticateToken, async (req, res) => {
    try {
        const allUsers = await usersCollection.find({}).toArray();
        res.status(200).json(allUsers);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update a user
user.put('/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, email, password } = req.body;

        // Convert userId to ObjectId     
        const objectId = new ObjectId(userId);

        // Find the user in the database
        const originalObject = await usersCollection.findOne({ _id: objectId });

        if (!originalObject) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new instance of the UserUpdate
        const userUpdate = new UserUpdate(originalObject, username, email, password);

        if (password) {
            // Hash the password
            userUpdate.password = await bcrypt.hash(password, 10);
        }

        // Update the user in the database
        const updatedUser = await usersCollection.updateOne(
            { _id: objectId },
            { $set: userUpdate },
            { returnOriginal: false }
        );

        res.status(200).json({message: 'User updated successfully'});
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete an existing user
user.delete('/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Convert userId to ObjectId     
        const objectId = new ObjectId(userId);

        // Find the user in the database
        const originalObject = await usersCollection.findOne({ _id: objectId });

        if (!originalObject) {
            return res.status(404).json({ error: 'User not found' });
        }

        
        await usersCollection.deleteOne({ _id: originalObject._id });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
});

export default user;
