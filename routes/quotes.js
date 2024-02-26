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

router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      throw new Error('MongoDB connection not established');
    }
    const collection = db.collection('rooms');

    // Check if a room with the same roomId already exists
    const existingRoom = await collection.findOne({ roomId: req.body.roomId });

    if (existingRoom) {
      // If a room with the same roomId exists, update it
      const updatedRoom = await collection.findOneAndUpdate(
        { roomId: req.body.roomId },
        { $set: req.body },
        { returnOriginal: false }
      );
      // Return the updated room
      return res.json(await collection.find({}).toArray());
    } else {
      // If no room with the same roomId exists, create a new room
      const newRoom = await collection.insertOne(req.body);
      // Return the newly created room
      return res.json(await collection.find({}).toArray());
    }
  } catch (error) {
    console.error('Error creating or updating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// PUT (or PATCH) an update to a room by ID
router.put('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      throw new Error('MongoDB connection not established');
    }
    const collection = db.collection('rooms');
    const updatedRoom = await collection.findOneAndUpdate(
      { roomId: req.body.roomId },
      { $set: req.body },
      { returnOriginal: false }
    );
    res.json(await collection.find({}).toArray());
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
    const deletedRoom = await collection.findOneAndDelete({ roomId: req.params.roomId });
    if (!deletedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(await collection.find({}).toArray());
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
