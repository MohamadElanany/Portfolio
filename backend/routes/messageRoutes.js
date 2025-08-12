const express = require('express');
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  deleteMessage
} = require('../controllers/messageController');

// إرسال رسالة (public)
router.post('/', createMessage);      // POST   /api/messages

// جلب كل الرسائل (public)
router.get('/', getAllMessages);      // GET    /api/messages

// حذف رسالة (public)
router.delete('/:id', deleteMessage);// DELETE /api/messages/:id

module.exports = router;
