const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String, // Will be hashed
});

module.exports = mongoose.model('Admin', AdminSchema);
