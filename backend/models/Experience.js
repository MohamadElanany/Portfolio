const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Experience', experienceSchema);
