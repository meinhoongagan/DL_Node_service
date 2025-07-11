const express = require('express');
const router = express.Router();
const { Schedule, ScheduleContent } = require('../models/schedule');
const Summary = require('../models/summary');

// ✅ Create a new Schedule
router.post('/', async (req, res) => {
    try {
        const newSchedule = new Schedule(req.body);
        const savedSchedule = await newSchedule.save();
        // Update the summary document
        const summary = await Summary.findOneAndUpdate(
            { user: req.body.user_id }, 
            { $inc: { total_schedules: 1 } },
            { new: true, upsert: true }
        );
        res.status(201).json({ message: 'Schedule created successfully', data: savedSchedule });
    } catch (error) {
        res.status(400).json({ message: 'Error creating schedule', error: error.message });
    }
});

// ✅ Get all Schedules
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
});

// ✅ Get Schedule Summary
router.get('/summary', async (req, res) => {
    try {
        const scheduleCount = await Schedule.countDocuments();
        const contentCount = await ScheduleContent.countDocuments();
        
        res.json({ 
            total_schedules: scheduleCount,
            total_schedule_contents: contentCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule summary', error: error.message });
    }
});

// ✅ Update a Schedule by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedSchedule = await Schedule.find({ schedule_id: req.params.id }).updateOne({ $set: req.body });
        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json({ message: 'Schedule updated successfully', data: updatedSchedule });
    } catch (error) {
        res.status(400).json({ message: 'Error updating schedule', error: error.message });
    }
});

// ✅ Delete a Schedule by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSchedule = await Schedule.find({ schedule_id: req.params.id }).deleteOne();
        if (!deletedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule', error: error.message });
    }
});

// ✅ Create a new Schedule Content
router.post('/content', async (req, res) => {
    try {
        const newScheduleContent = new ScheduleContent(req.body);
        const savedScheduleContent = await newScheduleContent.save();
        res.status(201).json({ message: 'Schedule content created successfully', data: savedScheduleContent });
    } catch (error) {
        res.status(400).json({ message: 'Error creating schedule content', error: error.message });
    }
});

// ✅ Get all Schedule Contents
router.get('/content', async (req, res) => {
    try {
        const scheduleContents = await ScheduleContent.find();
        res.json(scheduleContents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule contents', error: error.message });
    }
});

// ✅ Delete a Schedule Content by ID
router.delete('/content/:id', async (req, res) => {
    try {
        const deletedContent = await ScheduleContent.find({ content_id: req.params.id }).deleteOne();
        if (!deletedContent) {
            return res.status(404).json({ message: 'Schedule content not found' });
        }
        res.json({ message: 'Schedule content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule content', error: error.message });
    }
});

module.exports = router;