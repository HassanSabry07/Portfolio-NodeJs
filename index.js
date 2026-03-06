const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const home = require('./home');
const about = require('./about');
const experience = require('./experince');
const skills = require('./skills');
const projects = require('./projects');
const contact = require('./contact');
const auth = require('./auth');
const messages = require('./msg'); // ← جديد

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/home', home);
app.use('/about', about);
app.use('/experience', experience);
app.use('/skills', skills);
app.use('/projects', projects);
app.use('/contact', contact);
app.use('/api/auth', auth);
app.use('/messages', messages); // ← جديد

mongoose.connect('mongodb+srv://hassansabry116:01111309309@cluster0.2fwp18.mongodb.net/myDB?appName=Cluster0')
    .then(() => console.log('✅ Database connected successfully'))
    .catch((err) => console.log('❌ Database connection error:', err));

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});