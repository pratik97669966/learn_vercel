const { Long } = require('mongodb');
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomTittle: String,
    roomDescription: String,
    roomId: { type: String, unique: true }, // Enforce uniqueness on roomId field
    host: String,
    visibility: String,
    language: String,
    startTime: Number,
    endTime: Number,
    password: Number,
    cardColour: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
