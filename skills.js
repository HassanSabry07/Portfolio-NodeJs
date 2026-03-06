const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const skillsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String },
    icon: { type: String } // ✅ نص بس زي "angular", "react"
});

const Skills = mongoose.model('Skills', skillsSchema);

/* POST */
router.post('/', async (req, res) => {
    try {
        const skill = await Skills.create({
            name: req.body.name,
            level: req.body.level,
            icon: req.body.icon // ✅ بياخد النص مباشرة
        });
        res.status(201).json(skill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* GET ALL */
router.get('/', async (req, res) => {
    try {
        const skills = await Skills.find();
        res.status(200).json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* UPDATE */
router.put('/:id', async (req, res) => {
    try {
        const skill = await Skills.findById(req.params.id);
        if (!skill) return res.status(404).json({ message: "Skill not found" });

        if (req.body.name) skill.name = req.body.name;
        if (req.body.level) skill.level = req.body.level;
        if (req.body.icon) skill.icon = req.body.icon; // ✅ بياخد النص مباشرة

        await skill.save();
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* DELETE */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skills.deleteOne({ _id: id });
        if (skill.deletedCount === 0) return res.status(404).json({ message: "No Skill found" });
        res.json({ message: "Deleted successfully", deleted: skill });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;