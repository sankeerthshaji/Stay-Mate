const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    breakfast: {
        type: String,
        required: true
    },
    lunch: {
        type: String,
        required: true
    },
    snacks: {
        type: String,
        required: true
    },
    dinner: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Menu', menuSchema);