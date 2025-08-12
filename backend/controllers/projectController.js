const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

const uploadsPath = path.join(__dirname, '..', 'uploads');

function filePathFromUrl(url) {
    if (!url) return null;
    try {
        return path.join(uploadsPath, path.basename(url));
    } catch {
        return null;
    }
}

// ===== GET all projects =====
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ _id: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ===== GET project by id =====
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ===== CREATE project =====
exports.createProject = async (req, res) => {
    try {
        const photoUrl = req.file
        ? `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`
        : '';

        const tools = req.body.tools ? JSON.parse(req.body.tools) : [];
        const links = req.body.links ? JSON.parse(req.body.links) : {};

        const project = new Project({
        photoUrl,
        title: req.body.title,
        description: req.body.description,
        tools,
        links
        });

        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ===== UPDATE project =====
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // handle new uploaded file
        if (req.file) {
        // delete old file if exists
        const oldPath = filePathFromUrl(project.photoUrl);
        if (oldPath && fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) { console.error('delete old file error', e); }
        }
        project.photoUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
        }

        if (req.body.title) project.title = req.body.title;
        if (req.body.description) project.description = req.body.description;
        if (req.body.tools) project.tools = JSON.parse(req.body.tools);
        if (req.body.links) project.links = JSON.parse(req.body.links);

        await project.save();
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ===== DELETE project =====
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // delete local file if exists
        const oldPath = filePathFromUrl(project.photoUrl);
        if (oldPath && fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { console.error('delete file error', e); }
        }

        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
