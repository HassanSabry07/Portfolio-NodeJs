const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const router = express.Router();
const upload = require('./uploads'); // multer middleware

const aboutSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }
});

const About = mongoose.model('About', aboutSchema);

/* POST */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const about = await About.create({
            heading: req.body.heading,
            description: req.body.description,
            image: req.file ? req.file.filename : null
        });
        res.status(201).json(about);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* GET ALL */
router.get('/', async (req, res) => {
    try {
        const abouts = await About.find();
        res.status(200).json(abouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* UPDATE */
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const about = await About.findById(req.params.id);
        if (!about) return res.status(404).json({ message: "About not found" });

        if (req.body.heading) about.heading = req.body.heading;
        if (req.body.description) about.description = req.body.description;

        if (req.file) {
            if (about.image) {
                const path = `./uploads/${about.image}`;
                if (fs.existsSync(path)) fs.unlinkSync(path);
            }
            about.image = req.file.filename;
        }

        await about.save();
        res.json(about);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* DELETE */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const about = await About.deleteOne({ _id: id });
        if (about.deletedCount === 0) return res.status(404).json({ message: "No About found" });
        res.json({ message: "Deleted successfully", deleted: about });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;