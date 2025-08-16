const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Contributor = require('../models/contributorsModel');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const {
    contributorId,
    firstName,
    lastName,
    email,
    password
  } = req.body;
  const role = 1;
  let Department = null;
  let profilePic = null;
  let status = 1;
  let dob = null;

  try {
    const existingContributor = await Contributor.findOne({ contributorId });
    if (existingContributor) {
      return res.status(400).json({ msg: 'Contributor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const contributor = new Contributor({
      contributorId,
      firstName,
      lastName,
      email,
      dob,
      role,
      status,
      Department,
      profilePic,
      password: hashedPassword
    });

    await contributor.save();

    const token = jwt.sign({ id: contributor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      token,
      contributor: {
        id: contributor._id,
        contributorId,
        firstName,
        lastName,
        email,
        dob,
        role,
        status,
        Department
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const contributor = await Contributor.findOne({ email });
    console.log(contributor)
    if (!contributor) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, contributor.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: contributor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      contributor: {
        id: contributor._id,
        contributorId: contributor.contributorId,
        firstName: contributor.firstName,
        lastName: contributor.lastName,
        email: contributor.email,
        dob: contributor.dob,
        role: contributor.role,
        status: contributor.status,
        Department: contributor.Department
      }
    });

  } catch (err) {
    // console.error(err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

module.exports = router;
