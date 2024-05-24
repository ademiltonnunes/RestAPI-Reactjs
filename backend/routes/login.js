import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getSecret } from '../settings/crypto.js';
const login = express.Router();

// Loggers
import { getLoggerInstance } from '../settings/logger.js';
const logger = getLoggerInstance();

// Connect to the database
import { connectToDatabase } from '../settings/database.js';
const db = await connectToDatabase();
const usersCollection = db.collection('users');

// User login
login.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await usersCollection.findOne({ username });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Get the secret key
        const secret = await getSecret();

        // Generate a token
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        logger.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
});

export default login;
