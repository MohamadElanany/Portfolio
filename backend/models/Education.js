const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String
});

const educationSchema = new mongoose.Schema({
    degree:      { type: String, required: true },
    university:  { type: String, required: true },
    year:        { type: String, required: true },
    description: String,
    courses:     { type: [courseSchema], default: [] }
});

module.exports = mongoose.model('Education', educationSchema);
