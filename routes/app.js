const express = require('express');
const router = express.Router();
const App = require('../models/app'); // Import App model

// 🎯 **POST API - Create a new App**
router.post('/', async (req, res) => {
    try {
        const appData = req.body;

        const newApp = new App(appData);
        const savedApp = await newApp.save();
        res.status(201).json({ message: 'App created successfully', data: savedApp });
    } catch (error) {
        res.status(400).json({ message: 'Error creating app', error: error.message });
    }
});

// 🎯 **PUT API - Update an App by ID**
router.put('/:app_id', async (req, res) => {
    try {
        const updatedApp = await App.findOneAndUpdate(
            { app_id: req.params.app_id }, 
            req.body, 
            { new: true } // Return the updated document
        );

        if (!updatedApp) {
            return res.status(404).json({ message: 'App not found' });
        }

        res.json({ message: 'App updated successfully', data: updatedApp });
    } catch (error) {
        res.status(400).json({ message: 'Error updating app', error: error.message });
    }
});

module.exports = router;
