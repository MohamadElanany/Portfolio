const Message = require('../models/Message');

// استقبال رسالة جديدة
exports.createMessage = async (req, res) => {
    try {
        const msg = new Message(req.body);
        await msg.save();
        res.status(201).json({ success: true, message: 'Message sent!', data: msg });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// جلب كل الرسائل
exports.getAllMessages = async (req, res) => {
    try {
        const msgs = await Message.find().sort({ date: -1 });
        res.json({ success: true, data: msgs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// حذف رسالة
exports.deleteMessage = async (req, res) => {
    try {
        const msg = await Message.findByIdAndDelete(req.params.id);
        if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
        res.json({ success: true, message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
