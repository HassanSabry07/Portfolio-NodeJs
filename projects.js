const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const router = express.Router();
const upload = require('./uploads');

const projectsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    link: { type: String }
});
// tools 
const Projects = mongoose.model('Projects', projectsSchema);

/* POST */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const project = await Projects.create({
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            image: req.file ? req.file.filename : null
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* GET ALL */
router.get('/', async (req, res) => {
    try {
        const projects = await Projects.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* UPDATE */
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const project = await Projects.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (req.body.title) project.title = req.body.title;
        if (req.body.description) project.description = req.body.description;
        if (req.body.link) project.link = req.body.link;

        if (req.file) {
            if (project.image) {
                const path = `./uploads/${project.image}`;
                if (fs.existsSync(path)) fs.unlinkSync(path);
            }
            project.image = req.file.filename;
        }

        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* DELETE */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Projects.deleteOne({ _id: id });
        if (project.deletedCount === 0) return res.status(404).json({ message: "No Project found" });
        res.json({ message: "Deleted successfully", deleted: project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;