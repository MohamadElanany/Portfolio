const Education = require('../models/Education');

// جلب كل التعليم
exports.getAllEducation = async (req, res) => {
    try {
        const list = await Education.find().sort({ year: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// جلب سجل تعليم واحد
exports.getEducationById = async (req, res) => {
    try {
        const edu = await Education.findById(req.params.id);
        if (!edu) return res.status(404).json({ message: 'Education not found' });
        res.json(edu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// إنشاء سجل تعليم جديد
exports.createEducation = async (req, res) => {
    try {
        const edu = new Education(req.body);
        await edu.save();
        res.status(201).json(edu);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// تحديث سجل تعليم
exports.updateEducation = async (req, res) => {
    try {
        const edu = await Education.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        if (!edu) return res.status(404).json({ message: 'Education not found' });
        res.json(edu);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// حذف سجل تعليم
exports.deleteEducation = async (req, res) => {
    try {
        const edu = await Education.findByIdAndDelete(req.params.id);
        if (!edu) return res.status(404).json({ message: 'Education not found' });
        res.json({ message: 'Education deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
