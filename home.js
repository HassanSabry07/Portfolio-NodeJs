const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const router = express.Router();
const upload = require("./uploads");

const homeSchema = new mongoose.Schema({
  title:      { type: String},
  content:    { type: String},
  roles:      [{ type: String, trim: true }], // ✅ array - ["Full Stack Developer", "Tester"]
  image:      { type: String },
  cvURL:      { type: String, trim: true },
  projectURL: { type: String, trim: true },
  linkedIn:   { type: String, trim: true },
  gitHub:     { type: String, trim: true },
  email:      { type: String, trim: true, lowercase: true },
  phone:      { type: String, trim: true },
});

const Home = mongoose.model("Home", homeSchema);

/* POST */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const home = await Home.create({
      title:      req.body.title,
      content:    req.body.content,
      roles:      req.body.roles ? JSON.parse(req.body.roles) : [],
      image:      req.file ? req.file.filename : null,
      cvURL:      req.body.cvURL,
      projectURL: req.body.projectURL,
      linkedIn:   req.body.linkedIn,
      gitHub:     req.body.gitHub,
      email:      req.body.email,
      phone:      req.body.phone,
    });
    res.status(201).json(home);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL */
router.get("/", async (req, res) => {
  try {
    const homes = await Home.find().sort({ _id: -1 });
    res.status(200).json(homes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ONE */
router.get("/:id", async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Not found" });
    res.json(home);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Not found" });

    Object.keys(req.body).forEach(key => {
      if (key === 'roles') {
        home.roles = req.body.roles ? JSON.parse(req.body.roles) : [];
      } else {
        home[key] = req.body[key];
      }
    });

    if (req.file) {
      if (home.image) {
        const oldPath = `./uploads/${home.image}`;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      home.image = req.file.filename;
    }

    await home.save();
    res.json(home);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Not found" });

    if (home.image) {
      const imgPath = `./uploads/${home.image}`;
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Home.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;