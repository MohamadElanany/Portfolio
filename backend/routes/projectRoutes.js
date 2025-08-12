const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const upload = require('../middleware/upload');


router.get('/', getAllProjects);           // GET  /api/projects
router.get('/:id', getProjectById);        // GET  /api/projects/:id
//router.post('/', createProject);           // POST /api/projects
router.post('/', upload.single('photo'), createProject);
//router.put('/:id', updateProject);         // PUT  /api/projects/:id
router.put('/:id', upload.single('photo'), updateProject);
router.delete('/:id', deleteProject);      // DELETE /api/projects/:id

module.exports = router;
