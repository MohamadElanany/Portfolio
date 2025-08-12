const express = require('express');
const router = express.Router();
const {
    getAllExperience,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
} = require('../controllers/experienceController');

router.get('/', getAllExperience);          // GET    /api/experience
router.get('/:id', getExperienceById);      // GET    /api/experience/:id
router.post('/', createExperience);         // POST   /api/experience
router.put('/:id', updateExperience);       // PUT    /api/experience/:id
router.delete('/:id', deleteExperience);    // DELETE /api/experience/:id

module.exports = router;
