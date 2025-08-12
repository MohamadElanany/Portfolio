const Experience = require('../models/Experience');

// جلب كل الخبرات
exports.getAllExperience = async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ startDate: -1 });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// جلب خبرة واحدة
exports.getExperienceById = async (req, res) => {
    try {
        const exp = await Experience.findById(req.params.id);
        if (!exp) return res.status(404).json({ message: 'Experience not found' });
        res.json(exp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// إنشاء خبرة جديدة
exports.createExperience = async (req, res) => {
    try {
        const exp = new Experience(req.body);
        await exp.save();
        res.status(201).json(exp);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// تحديث خبرة
exports.updateExperience = async (req, res) => {
    try {
        const exp = await Experience.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        if (!exp) return res.status(404).json({ message: 'Experience not found' });
        res.json(exp);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// حذف خبرة
exports.deleteExperience = async (req, res) => {
    try {
        const exp = await Experience.findByIdAndDelete(req.params.id);
        if (!exp) return res.status(404).json({ message: 'Experience not found' });
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
