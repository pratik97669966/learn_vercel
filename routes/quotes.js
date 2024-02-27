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
      const { roomTittle, roomDescription, host, visibility, language, password, cardColour } = req.body;
      const updateFields = { roomTittle, roomDescription, host, visibility, language, password, cardColour };
      const updatedRoom = await collection.findOneAndUpdate(
        { roomId: req.body.roomId },
        { $set: updateFields },
        { returnOriginal: false }
      ).then(async () => {
        const rooms = await collection.find({}).toArray();
        res.json(rooms);
      });
    } else {
      const newRoom = await collection.insertOne(req.body)
        .then(async () => {
          const rooms = await collection.find({}).toArray();
          res.json(rooms);
        });
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
    const { roomTittle, roomDescription, host, visibility, language, password, cardColour } = req.body;
    const updateFields = { roomTittle, roomDescription, host, visibility, language, password, cardColour };
    const updatedRoom = await collection.findOneAndUpdate(
      { roomId: req.body.roomId },
      { $set: updateFields },
      { returnOriginal: false }
    ).then(async () => {
      const rooms = await collection.find({}).toArray();
      res.json(rooms);
    });
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
    const deletedRoom = await collection.findOneAndDelete({ roomId: req.params.roomId }).then(async () => {
      const rooms = await collection.find({}).toArray();
      res.json(rooms);
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
