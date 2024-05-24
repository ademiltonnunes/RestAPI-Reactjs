import jwt from 'jsonwebtoken';
import { getSecret } from './crypto.js';

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: "User not logged in" });;

    try {
        const secret = await getSecret();
        jwt.verify(token, secret, (err, user) => {
            if (err) return res.status(403).json({ error: "Log into the system" });;
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error in authenticateToken:', error);
        res.status(500).json({ error: error.message });
    }
};

export { authenticateToken };