const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    breakfast: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    lunch: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    snacks: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    dinner: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    }
});

module.exports = mongoose.model('Menu', menuSchema);