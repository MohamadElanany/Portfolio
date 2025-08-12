const express = require('express');
const router = express.Router();
const {
    getAllEducation,
    getEducationById,
    createEducation,
    updateEducation,
    deleteEducation
} = require('../controllers/educationController');

router.get('/', getAllEducation);          // GET    /api/education
router.get('/:id', getEducationById);      // GET    /api/education/:id
router.post('/', createEducation);         // POST   /api/education
router.put('/:id', updateEducation);       // PUT    /api/education/:id
router.delete('/:id', deleteEducation);    // DELETE /api/education/:id

module.exports = router;
