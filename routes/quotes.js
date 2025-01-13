const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const { ObjectId } = require('mongodb');
//const databaseName='Ashish';
const databaseName='rooms';

async function getActiveRooms(db) {
  try {
    if (!db) {
      console.error('MongoDB connection not established');
      return [];
    }
    
    const collection = db.collection(databaseName);
    const currentTime = Date.now();
    const activeRooms = await collection.find({ endTime: { $gte: currentTime } }).toArray();
    return activeRooms;
  } catch (error) {
    console.error('Error fetching active rooms:', error);
  }
}
// GET all rooms
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      console.error('MongoDB connection not established');
    }
    const collection = db.collection(databaseName);
    const activeRooms = await getActiveRooms(db);
    res.json(activeRooms);
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
    const collection = db.collection(databaseName);
    const existingRoom = await collection.findOne({ roomId: req.body.roomId });
    if (existingRoom) {
      const { roomTittle, roomDescription, host, visibility, language, startTime, password, cardColour, endTime } = req.body;
      const currentTime = Date.now();
      let calculatedEndTime;
      switch (endTime) {
        case 1:
          calculatedEndTime = currentTime + (4 * 60 * 60 * 1000); // Add 1 hour
          break;
        case 2:
          calculatedEndTime = currentTime + (4 * 60 * 60 * 1000); // Add 2 hours
          break;
        case 3:
          calculatedEndTime = currentTime + (4 * 60 * 60 * 1000); // Add 3 hours
          break;
        default:
          calculatedEndTime = currentTime + (4 * 60 * 60 * 1000); // Default to 1 hour
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
        const activeRooms = await getActiveRooms(db);
        res.json(activeRooms);
      });
    }
    else {
      const addBody = req.body;
      const startTimefinal = Date.now();
      addBody.startTime = startTimefinal;
      switch (addBody.endTime) {
        case 1:
          addBody.endTime = startTimefinal + (4 * 60 * 60 * 1000); // Add 1 hour
          break;
        case 2:
          addBody.endTime = startTimefinal + (4 * 60 * 60 * 1000); // Add 2 hours
          break;
        case 3:
          addBody.endTime = startTimefinal + (4 * 60 * 60 * 1000); // Add 3 hours
          break;
        default:
          addBody.endTime = startTimefinal + (4 * 60 * 60 * 1000); // Default to 1 hour
          break;
      }
      await collection.insertOne(addBody)
        .then(async () => {
          const activeRooms = await getActiveRooms(db);
          res.json(activeRooms);
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
    const collection = db.collection(databaseName);
    const { roomTittle, roomDescription, host, visibility, language, password, cardColour, endTime } = req.body;
    const startTime = Date.now();
    let calculatedEndTime;
    switch (endTime) {
      case 1:
        calculatedEndTime = startTime + (4 * 60 * 60 * 1000); // Add 1 hour
        break;
      case 2:
        calculatedEndTime = startTime + (4 * 60 * 60 * 1000); // Add 2 hours
        break;
      case 3:
        calculatedEndTime = startTime + (4 * 60 * 60 * 1000); // Add 3 hours
        break;
      default:
        calculatedEndTime = startTime + (4 * 60 * 60 * 1000); // Add 1 hour
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
      const activeRooms = await getActiveRooms(db);
      res.json(activeRooms);
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// DELETE a room by roomId or _id
router.delete('/:roomId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) return res.status(500).json({ error: 'Database connection error' });

    const { roomId } = req.params;
    const collection = db.collection(databaseName);

    const query = roomId.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: new (require('mongodb')).ObjectId(roomId) }
      : { roomId };

    await collection.findOneAndDelete(query);

    res.json(await getActiveRooms(db));
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;