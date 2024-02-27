const express = require('express');
const router = express.Router();
const Room = require('../models/room');

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      console.error('MongoDB connection not established');
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
      console.error('MongoDB connection not established');
    }
    const collection = db.collection('rooms');
    const existingRoom = await collection.findOne({ roomId: req.body.roomId });
    if (existingRoom) {
      const { roomTittle, roomDescription, host, visibility, language, startTime, password, cardColour, endTime } = req.body;
      const currentTime = Date.now();
      let calculatedEndTime;
      switch (endTime) {
        case 1:
          calculatedEndTime = currentTime + (1 * 60 * 60 * 1000); // Add 1 hour
          break;
        case 2:
          calculatedEndTime = currentTime + (2 * 60 * 60 * 1000); // Add 2 hours
          break;
        case 3:
          calculatedEndTime = currentTime + (3 * 60 * 60 * 1000); // Add 3 hours
          break;
        default:
          calculatedEndTime = currentTime + (1 * 60 * 60 * 1000); // Default to 1 hour
      }

      const updateFields = {
        roomTittle,
        roomDescription,
        host,
        visibility,
        language,
        startTime: currentTime,
        endTime: calculatedEndTime,
        password,
        cardColour
      };

      await collection.findOneAndUpdate(
        { roomId: req.body.roomId },
        { $set: updateFields },
        { returnOriginal: false }
      ).then(async () => {
        const rooms = await collection.find({}).toArray();
        res.json(rooms);
      });
    }
    else {
      const addBody = req.body;
      const startTimefinal = Date.now();
      addBody.startTime = startTimefinal;
      switch (addBody.endTime) {
        case 1:
          addBody.endTime = startTimefinal + (1 * 60 * 60 * 1000); // Add 1 hour
          break;
        case 2:
          addBody.endTime = startTimefinal + (2 * 60 * 60 * 1000); // Add 2 hours
          break;
        case 3:
          addBody.endTime = startTimefinal + (3 * 60 * 60 * 1000); // Add 3 hours
          break;
        default:
          addBody.endTime = startTimefinal + (1 * 60 * 60 * 1000); // Default to 1 hour
          break;
      }
      await collection.insertOne(addBody)
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
      console.error('MongoDB connection not established');
    }
    const collection = db.collection('rooms');
    const { roomTittle, roomDescription, host, visibility, language, password, cardColour, endTime } = req.body;
    const startTime = Date.now();
    let calculatedEndTime;
    switch (endTime) {
      case 1:
        calculatedEndTime = startTime + (1 * 60 * 60 * 1000); // Add 1 hour
        break;
      case 2:
        calculatedEndTime = startTime + (2 * 60 * 60 * 1000); // Add 2 hours
        break;
      case 3:
        calculatedEndTime = startTime + (3 * 60 * 60 * 1000); // Add 3 hours
        break;
      default:
        calculatedEndTime = startTime + (1 * 60 * 60 * 1000); // Add 1 hour
    }

    const updateFields = {
      roomTittle,
      roomDescription,
      host,
      visibility,
      language,
      startTime,
      endTime: calculatedEndTime,
      password,
      cardColour
    };

    await collection.findOneAndUpdate(
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
      console.error('MongoDB connection not established');
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
