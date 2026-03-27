const express = require('express');
const router = express.Router();
const Laundry = require('../models/Laundry');
const auth = require('../middleware/auth');

// Function to delete entries older than 2 days
async function deleteOldEntries() {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = await Laundry.deleteMany({ 
      createdAt: { $lt: twoDaysAgo }
    });
    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} old entries`);
    }
  } catch (error) {
    console.error('Error deleting old entries:', error.message);
  }
}

// Run cleanup on startup and every hour
setInterval(deleteOldEntries, 60 * 60 * 1000); // Every 60 minutes
deleteOldEntries(); // Run immediately on startup

// Create new laundry entry (Admin Only)
router.post('/create', auth, async (req, res) => {
  try {
    const { token, washType, items, notes } = req.body;
    
    if (!token || !washType || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const laundry = new Laundry({
      token,
      washType,
      items,
      notes,
      status: 'Pending',
      createdBy: req.admin._id
    });

    await laundry.save();
    res.json({ message: 'Entry created successfully', entry: laundry });
  } catch (error) {
    console.error('Error creating laundry entry:', error.message);
    res.status(500).json({ message: 'Error creating entry', error: error.message });
  }
});

// Get all entries (Admin Only)
router.get('/entries', auth, async (req, res) => {
  try {
    // Delete old entries before returning
    await deleteOldEntries();
    
    const entries = await Laundry.find({ createdBy: req.admin._id }).populate('createdBy', 'name email');
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error.message);
    res.status(500).json({ message: 'Error fetching entries', error: error.message });
  }
});

// Check Status
router.get('/status/:token', async (req, res) => {
  try {
    const laundry = await Laundry.findOne({ token: req.params.token });
    if (!laundry) return res.status(404).json({ message: 'Token not found' });
    res.json({ 
      status: laundry.status,
      token: laundry.token,
      washType: laundry.washType,
      items: laundry.items,
      notes: laundry.notes,
      createdAt: laundry.createdAt
    });
  } catch (error) {
    console.error('Error checking status:', error.message);
    res.status(500).json({ message: 'Error checking status', error: error.message });
  }
});

// Admin - Mark as Completed
router.post('/complete/:token', auth, async (req, res) => {
  try {
    const laundry = await Laundry.findOne({ token: req.params.token });
    if (!laundry) return res.status(404).json({ message: 'Token not found' });
    laundry.status = 'Completed';
    await laundry.save();
    res.json({ message: 'Status updated to Completed' });
  } catch (error) {
    console.error('Error completing entry:', error.message);
    res.status(500).json({ message: 'Error completing entry', error: error.message });
  }
});

// Admin - Manually trigger cleanup of old entries
router.post('/cleanup-old', auth, async (req, res) => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = await Laundry.deleteMany({ 
      createdBy: req.admin._id,
      createdAt: { $lt: twoDaysAgo }
    });
    res.json({ 
      message: `Deleted ${result.deletedCount} entries older than 2 days`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up old entries:', error.message);
    res.status(500).json({ message: 'Error cleaning up entries', error: error.message });
  }
});

module.exports = router;
