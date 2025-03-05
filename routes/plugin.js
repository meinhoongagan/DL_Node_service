const express = require('express');
const router = express.Router();
const Plugin = require('../models/plugin'); // Import Plugin model

// ✅ Create a new Plugin
router.post('/', async (req, res) => {
    try {
        const newPlugin = new Plugin(req.body);
        const savedPlugin = await newPlugin.save();
        res.status(201).json({ message: 'Plugin created successfully', data: savedPlugin });
    } catch (error) {
        res.status(400).json({ message: 'Error creating plugin', error: error.message });
    }
});

// ✅ Get all Plugins
router.get('/', async (req, res) => {
    try {
        const plugins = await Plugin.find();
        res.json(plugins);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching plugins', error: error.message });
    }
});

// ✅ Update a Plugin by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPlugin = await Plugin.find({ plugin_id: req.params.id }).updateOne({ $set: req.body });
        if (!updatedPlugin) {
            return res.status(404).json({ message: 'Plugin not found' });
        }
        res.json({ message: 'Plugin updated successfully', data: updatedPlugin });
    } catch (error) {
        res.status(400).json({ message: 'Error updating plugin', error: error.message });
    }
});

// ✅ Delete a Plugin by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPlugin = await Plugin.find({ plugin_id: req.params.id }).deleteOne();
        if (!deletedPlugin) {
            return res.status(404).json({ message: 'Plugin not found' });
        }
        res.json({ message: 'Plugin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting plugin', error: error.message });
    }
});

module.exports = router;
