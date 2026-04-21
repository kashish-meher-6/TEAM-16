const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');
const { upload } = require('../config/upload');
const Member  = require('../models/Member');

router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]),
  async (req, res) => {  try {
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

  image: req.files?.image
    ? `uploads/${req.files.image[0].filename}`
    : '',

  document: req.files?.document
    ? `uploads/${req.files.document[0].filename}`
    : '',
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

// GET single member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json(member);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;