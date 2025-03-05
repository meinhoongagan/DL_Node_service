const express = require('express');
const router = express.Router();
const Player = require('../models/player'); // Import Player model
const mongoose = require('mongoose');

// ✅ Create a new Player (POST)
router.post('/', async (req, res) => {
    try {
        console.log("Incoming request body:", req.body); // Log request data

        console.log("Mongoose connected to:", mongoose.connection.name); // Log DB name

        const newPlayer = new Player(req.body);
        const savedPlayer = await newPlayer.save(); // ✅ Save to DB
        res.status(201).json({ message: 'Player created successfully', data: savedPlayer });
    } catch (error) {
        console.error("Error saving player:", error); // Log error
        res.status(400).json({ message: 'Error creating player', error: error.message });
    }
});


// ✅ Update a Player by ID (PUT)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPlayer = await Player.find({ player_id: id }).updateOne({ $set: req.body}) // ✅ Update in DB
        
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }

        res.json({ message: 'Player updated successfully', data: updatedPlayer });
    } catch (error) {
        res.status(400).json({ message: 'Error updating player', error: error.message });
    }
});

module.exports = router;

