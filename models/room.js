const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomTitle: String,
  roomDescription: String,
  roomId: { type: String, unique: true }, // Enforce uniqueness on roomId field
  host: String,
  visibility: String,
  language: String,
  startTime: Date,
  endTime: Date,
  password: String,
  cardColour: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
