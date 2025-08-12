const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    photoUrl: String,
    name:String,
    title: String,
    description: String,
    links: {
        cv: String,
        github: String,
        linkedin: String,
        gmail: String,
        phone: String,
        location: String
    }
});

module.exports = mongoose.model('Profile', profileSchema);
