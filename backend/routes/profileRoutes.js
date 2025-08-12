const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/profileController');
const upload = require('../middleware/upload');

router.get('/', getProfile);        // GET /api/profile
//router.post('/', upsertProfile);    // POST /api/profile
router.post('/', upload.single('photo'), upsertProfile);

module.exports = router;
