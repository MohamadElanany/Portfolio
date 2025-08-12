const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: [
        'Front-End',
        'Back-End',
        'Principles and Concepts',
        'Interpersonal Skills',
        "Tools & Technologies",
        'Other Programming Languages'
        ],
        required: true
    },
    items: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Skill', skillSchema);
