const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./user")

// Register

router.post("/register", async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json({ message: "User created Successfully!" });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) return res.status(404).json({ message: "User not found!" });

		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isMatch)
			return res.status(404).json({ message: "Invalid credentials!" });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});
		res.json({ token });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;