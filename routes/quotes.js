const express = require('express');
const router = express.Router();
const Room = require('../models/room');

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      throw new Error('MongoDB connection not established');
    }
    const collection = db.collection('rooms');
    const rooms = await collection.find({}).toArray();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new room
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      throw new Error('MongoDB connection not established');
    }
    const collection = db.collection('rooms');
    const newRoom = await collection.insertOne(req.body);
    res.json(await collection.find({}).toArray());
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (or PATCH) an update to a room by ID
router.put('/:roomId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      throw new Error('MongoDB connection not established');
    }
    const collection = db.collection('rooms');
    const updatedRoom = await collection.findOneAndUpdate(
      { roomId: ObjectId(req.params.roomId) },
      { $set: req.body },
      { returnOriginal: false }
    );
    if (!updatedRoom.value) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(updatedRoom.value);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a room by ID
router.delete('/:roomId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      throw new Error('MongoDB connection not established');
    }
    const collection = db.collection('rooms');
    const deletedRoom = await collection.findOneAndDelete({ roomId: ObjectId(req.params.roomId) });
    if (!deletedRoom.value) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(deletedRoom.value);
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
