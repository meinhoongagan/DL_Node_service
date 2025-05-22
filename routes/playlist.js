// Playlist Router - Summary route added (DELETE already exists)
const express = require('express');
const router = express.Router();
const { Playlist, PlaylistItem } = require('../models/playlist'); // Ensure this path is correct

// ✅ Create a new Playlist
router.post('/', async (req, res) => {
    try {
        const { playlist_name, playlist_id, user_id, shared_with_users, orientation, thumbnail, animation_type, status } = req.body;
        
        // Basic Validation
        if (!playlist_name || !playlist_id || !user_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const newPlaylist = new Playlist({
            playlist_name,
            playlist_id,
            user_id,
            shared_with_users: shared_with_users || [],
            orientation: orientation || null,
            thumbnail: thumbnail || null,
            animation_type: animation_type || null,
            status: status || 'DRAFT'
        });
        
        const savedPlaylist = await newPlaylist.save();
        // Update the summary document
        const summary = await Summary.findOneAndUpdate(
            {user: user_id}, // Assuming you want to update by user
            { $inc: { total_playlists: 1 } }, // Increment the total_playlists count
            { new: true, upsert: true } // Create a new document if it doesn't exist
        );
        res.status(201).json({ message: 'Playlist created successfully', data: savedPlaylist });
    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist', error: error.message });
    }
});

// ✅ Get all Playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists', error: error.message });
    }
});

// ✅ Get Playlist Summary
router.get('/summary', async (req, res) => {
    try {
        const playlistCount = await Playlist.countDocuments();
        const playlistItemCount = await PlaylistItem.countDocuments();
        
        res.json({ 
            total_playlists: playlistCount,
            total_playlist_items: playlistItemCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlist summary', error: error.message });
    }
});

// ✅ Update a Playlist by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPlaylist = await Playlist.find({ playlist_id: req.params.id }).updateOne({ $set: req.body })
        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json({ message: 'Playlist updated successfully', data: updatedPlaylist });
    } catch (error) {
        res.status(400).json({ message: 'Error updating playlist', error: error.message });
    }
});

// ✅ Delete a Playlist by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPlaylist = await Playlist.find({ playlist_id: req.params.id }).deleteOne();
        if (!deletedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting playlist', error: error.message });
    }
});

// ✅ Create a new Playlist Item
router.post('/items', async (req, res) => {
    try {
        const newPlaylistItem = new PlaylistItem(req.body);
        const savedPlaylistItem = await newPlaylistItem.save();
        res.status(201).json({ message: 'Playlist item created successfully', data: savedPlaylistItem });
        // Update the summary document
        const summary = await Summary.findOneAndUpdate(
            {user: req.body.user_id}, // Assuming you want to update by user
            {
                $inc: {
                    total_playlist_items: 1
                }
            },
            { new: true }
        );
        res.json({ message: 'Playlist item created successfully', data: savedPlaylistItem });
    } catch (error) {
        res.status(400).json({ message: 'Error creating playlist item', error: error.message });
    }
});

// ✅ Get Playlist Items
router.get('/items', async (req, res) => {
    try {
        const playlistItems = await PlaylistItem.find();
        res.json(playlistItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlist items', error: error.message });
    }
});

module.exports = router;