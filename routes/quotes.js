const express = require('express');
const router = express.Router();
const Room = require('../models/room');

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new room
router.post('/', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a room by ID
router.delete('/:roomId', async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.roomId);
    if (!deletedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(deletedRoom);
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (or PATCH) an update to a room by ID
router.put('/:roomId', async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.roomId, req.body, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
