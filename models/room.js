const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomTitle: String,
  roomDescription: String,
  host: String,
  visibility: String,
  language: String,
  startTime: Date,
  endTime: Date,
  password: String,
  cardColour: String
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
