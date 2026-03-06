const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const router = express.Router();
const upload = require('./uploads');

const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
    image: { type: String } // ✅ image بدل logo
});

const Experience = mongoose.model('Experience', experienceSchema);

/* POST */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const exp = await Experience.create({
            company: req.body.company,
            role: req.body.role,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            description: req.body.description,
            image: req.file ? req.file.filename : null
        });
        res.status(201).json(exp);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* GET ALL */
router.get('/', async (req, res) => {
    try {
        const exps = await Experience.find().sort({ startDate: -1 });
        res.status(200).json(exps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* GET BY ID */
router.get('/:id', async (req, res) => {
    try {
        const exp = await Experience.findById(req.params.id);
        if (!exp) return res.status(404).json({ message: "Experience not found" });
        res.status(200).json(exp);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* UPDATE */
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const exp = await Experience.findById(req.params.id);
        if (!exp) return res.status(404).json({ message: "Experience not found" });

        if (req.body.company) exp.company = req.body.company;
        if (req.body.role) exp.role = req.body.role;
        if (req.body.startDate) exp.startDate = req.body.startDate;
        if (req.body.endDate) exp.endDate = req.body.endDate;
        if (req.body.description) exp.description = req.body.description;

        if (req.file) {
            if (exp.image) {
                const oldPath = `./uploads/${exp.image}`;
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            exp.image = req.file.filename;
        }

        await exp.save();
        res.json(exp);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* DELETE */
router.delete('/:id', async (req, res) => {
    try {
        const exp = await Experience.findById(req.params.id);
        if (!exp) return res.status(404).json({ message: "Experience not found" });

        if (exp.image) {
            const imgPath = `./uploads/${exp.image}`;
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        await Experience.deleteOne({ _id: req.params.id });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;