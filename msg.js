const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const messageSchema = new mongoose.Schema({
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    message: { type: String, required: true },
    isRead:  { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

/* POST - بعت رسالة */
router.post('/', async (req, res) => {
    try {
        const msg = await Message.create({
            name:    req.body.name,
            email:   req.body.email,
            message: req.body.message
        });
        res.status(201).json(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* GET ALL - استقبل كل الرسائل */
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* PUT - تعليم كرسالة مقروءة */
router.put('/:id/read', async (req, res) => {
    try {
        const msg = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        res.json(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* DELETE */
router.delete('/:id', async (req, res) => {
    try {
        const msg = await Message.deleteOne({ _id: req.params.id });
        if (msg.deletedCount === 0) return res.status(404).json({ message: 'No message found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;