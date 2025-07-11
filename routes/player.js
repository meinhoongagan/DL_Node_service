const express = require('express');
const router = express.Router();
const Player = require('../models/player'); 
const mongoose = require('mongoose'); 
const Summary = require('../models/summary'); 

router.post('/', async (req, res) => {
    try {
        console.log("Incoming request body:", req.body); 
        
        console.log("Mongoose connected to:", mongoose.connection.name); 
        
        const newPlayer = new Player(req.body);
        const savedPlayer = await newPlayer.save();
        // Update the summary document
        const summary = await Summary.findOneAndUpdate(
            {user: req.body.user}, // Assuming you want to update by user
            { $inc: { total_players: 1 } },
            { new: true, upsert: true } 
        );
        res.status(201).json({ message: 'Player created successfully', data: savedPlayer });
    } catch (error) {
        console.error("Error saving player:", error); 
        res.status(400).json({ message: 'Error creating player', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching players', error: error.message });
    }
});

// ✅ Get Player Summary (GET)
router.get('/summary', async (req, res) => {
    try {
        const count = await Player.countDocuments();
        res.json({ 
            total: count ,
            online: 0,
            offline : 0,
            active: 0,
            inactive: 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching player summary', error: error.message });
    }
});

// ✅ Update a Player by ID (PUT)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPlayer = await Player.find({ player_id: id }).updateOne({ $set: req.body }) // ✅ Update in DB
        
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
        
        res.json({ message: 'Player updated successfully', data: updatedPlayer });
    } catch (error) {
        res.status(400).json({ message: 'Error updating player', error: error.message });
    }
});

// ✅ Delete a Player by ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedPlayer = await Player.find({ player_id: req.params.id }).deleteOne();
        
        if (!deletedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
        
        res.json({ message: 'Player deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting player', error: error.message });
    }
});

module.exports = router;