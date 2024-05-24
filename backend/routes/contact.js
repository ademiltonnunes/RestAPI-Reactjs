import express from 'express';
import { connectToDatabase } from '../settings/database.js';
import ContactCreate from '../model/contactCreate.js';
import { ObjectId } from 'mongodb';
const contact = express.Router();


// Connect to the database
const db = await connectToDatabase();
const contactCollection = db.collection('contacts');

// Create a new contact
contact.post('/', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const contactData = new ContactCreate(name, email, phone, message);

    console.log(contactData);

    try {
        const result = await contactCollection.insertOne(contactData);
        res.status(201).json({
            message: "Contact created successfully",
            contactId: result._id
        });
    } catch (error) {
        console.error("Failed to create contact:", error);
        res.status(500).json({ message: "Failed to create contact" });
    }
});



// GET all contacts
contact.get('/', async (req, res) => {
    try {
        const contacts = await contactCollection.find({read: false}).toArray();
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Failed to retrieve contacts:", error);
        res.status(500).json({ message: "Failed to retrieve contacts" });
    }
});

// Set the contact read
contact.patch('/:id', async (req, res) => {
    const { id } = req.params; 

    // Validate the ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
    }

    try {
        const result = await contactCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { read: true } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json({ message: "Contact read status updated to true", updatedId: id });
    } catch (error) {
        console.error("Failed to update contact:", error);
        res.status(500).json({ message: "Failed to update contact" });
    }
});


export default contact;