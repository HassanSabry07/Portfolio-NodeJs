const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const contactSchema = new mongoose.Schema({
  type:  { type: String, required: true }, // Email, Phone, LinkedIn...
  value: { type: String, required: true }, // القيمة الفعلية
  icon:  { type: String, required: true }, // Font Awesome icon name e.g. "envelope"
  link:  { type: String }                  // رابط اختياري
});

const Contact = mongoose.model('Contact', contactSchema);

/* GET ALL */
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* POST */
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create({
      type:  req.body.type,
      value: req.body.value,
      icon:  req.body.icon,
      link:  req.body.link
    });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PUT */
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Not found' });
    if (req.body.type)  contact.type  = req.body.type;
    if (req.body.value) contact.value = req.body.value;
    if (req.body.icon)  contact.icon  = req.body.icon;
    if (req.body.link !== undefined) contact.link = req.body.link;
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE */
router.delete('/:id', async (req, res) => {
  try {
    const result = await Contact.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;