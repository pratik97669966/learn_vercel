const express = require('express');
const router = express.Router();

// GET all quotes
// router.get('/', async (req, res) => {
//   const collection = req.app.locals.db.collection('instanttalk');
//   const quotes = await collection.find({}).toArray();
//   res.json(quotes);
// });
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      throw new Error('MongoDB connection not established');
    }
    const collection = db.collection('instanttalk');
    const quotes = await collection.find({}).toArray();
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/* POST quotes */
router.post('/', async function (req, res, next) {
  try {
    res.json(await quotes.create(req.body));
  } catch (err) {
    console.error(`Error while posting quotes `, err.message);
    res.status(err.statusCode || 500).json({ 'message': err.message });
  }
});

module.exports = router;
