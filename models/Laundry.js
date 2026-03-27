const mongoose = require('mongoose');

const LaundryItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const LaundrySchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  washType: {
    type: String,
    required: true,
    enum: ['Regular Wash', 'Dry Clean', 'Express Wash', 'Delicate Wash']
  },
  items: [LaundryItemSchema],
  notes: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Laundry', LaundrySchema);
