const mongoose = require('mongoose');

const LaundrySchema = new mongoose.Schema({
  name: String,
  contact: String,
  description: String,
  token: String,
  status: {
    type: String,
    default: 'Not Completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Laundry', LaundrySchema);
