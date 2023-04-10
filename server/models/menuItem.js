const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
