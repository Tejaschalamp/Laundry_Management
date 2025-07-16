const express = require('express');
const router = express.Router();
const Laundry = require('../models/Laundry');

const generateToken = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Submit Laundry
router.post('/submit', async (req, res) => {
  const { name, contact, description } = req.body;
  const token = generateToken();
  const laundry = new Laundry({ name, contact, description, token });
  await laundry.save();
  res.json({ token });
});

// Check Status
router.get('/status/:token', async (req, res) => {
  const laundry = await Laundry.findOne({ token: req.params.token });
  if (!laundry) return res.status(404).json({ message: 'Token not found' });
  res.json({ status: laundry.status });
});

// Admin - Mark as Completed
router.post('/complete/:token', async (req, res) => {
  const laundry = await Laundry.findOne({ token: req.params.token });
  if (!laundry) return res.status(404).json({ message: 'Token not found' });
  laundry.status = 'Completed';
  await laundry.save();
  res.json({ message: 'Status updated to Completed' });
});

module.exports = router;
