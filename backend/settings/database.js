import { MongoClient } from 'mongodb';
import 'dotenv/config';

const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const deploy = process.env.MONGO_DEPLOYMENT_NAME;
const dbName = process.env.MONGO_DB_NAME;
const url = `mongodb+srv://${username}:${password}@${deploy}.pm9tsqj.mongodb.net/`;


let db;

export async function connectToDatabase() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected to the database successfully');
        db = client.db(dbName);
        return db;

    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

export function getDb() {
    return db;
}

