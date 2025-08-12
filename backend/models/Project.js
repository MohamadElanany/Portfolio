const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    photoUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tools: {
        type: [String],
        default: []
    },
    links: {
        demo: {
        type: String,
        required: true
        },
        repo: {
        type: String,
        required: true
        }
    }
});

module.exports = mongoose.model('Project', projectSchema);
