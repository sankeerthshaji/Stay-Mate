const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: {
    type: String,
    required: true,
    unique: true
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  occupants: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'occupied'],
    default: 'available'
  },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
