const Profile = require('../models/Profile');
const fs = require('fs');
const path = require('path');

const uploadsPath = path.join(__dirname, '..', 'uploads');
function filePathFromUrl(url) {
    if (!url) return null;
    try { return path.join(uploadsPath, path.basename(url)); } catch { return null; }
}

exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.upsertProfile = async (req, res) => {
    try {
        const data = req.body;
        let profile = await Profile.findOne();

        // إذا تم رفع صورة جديدة
        if (req.file) {
        const newPhotoUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
        data.photoUrl = newPhotoUrl;

        // احذف الصورة القديمة لو موجودة
        if (profile && profile.photoUrl) {
            const oldPath = filePathFromUrl(profile.photoUrl);
            if (oldPath && fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) { console.error('delete old profile file', e); }
            }
        }
        }

        // روابط قد تُرسل كسلاسل JSON أو كـ body عادي
        if (data.links && typeof data.links === 'string') data.links = JSON.parse(data.links);

        if (profile) {
        profile = await Profile.findOneAndUpdate({}, data, { new: true });
        } else {
        profile = new Profile(data);
        await profile.save();
        }

        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
