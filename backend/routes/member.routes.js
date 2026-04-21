const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');
const { upload } = require('../config/upload');
const Member  = require('../models/Member');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, roll, year, degree, aboutProject, hobbies, certificate, internship, aboutYourAim } = req.body;

    if (!name || !roll || !year || !degree) {
      return res.status(400).json({ success: false, message: 'name, roll, year and degree are required.' });
    }

    const member = await Member.create({
      name: name.trim(),
      roll: roll.trim(),
      year: year.trim(),
      degree: degree.trim(),
      aboutProject: aboutProject || '',
      hobbies: hobbies || '',
      certificate: certificate || '',
      internship: internship || '',
      aboutYourAim: aboutYourAim || '',
      image: req.file ? `uploads/${req.file.filename}` : '',
    });

    res.status(201).json({ success: true, data: member });
  } catch (err) {
    console.error('POST /members error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

module.exports = router;