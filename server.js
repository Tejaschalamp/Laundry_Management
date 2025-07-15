require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Laundry = require('./models/Laundry');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Generate token
function generateToken() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

app.get("/",(req,res) =>{
  res.redirect("/index.html");
})

// Submit laundry
// app.post('/submit', async (req, res) => {
//   const token = generateToken();
//   const entry = new Laundry({ ...req.body, token });
//   await entry.save();
//   res.json({ token });
// });

// // Check status
// app.get('/status/:token', async (req, res) => {
//   const token = req.params.token.toUpperCase();
//   const record = await Laundry.findOne({ token });
//   if (!record) return res.status(404).json({ status: "Not Found" });
//   res.json({ status: record.status });
// });

// // Get all entries (Admin)
// app.get('/admin', async (req, res) => {
//   const records = await Laundry.find().sort({ createdAt: -1 });
//   res.json(records);
// });

// // Mark as completed
// app.post('/complete/:token', async (req, res) => {
//   const token = req.params.token.toUpperCase();
//   await Laundry.updateOne({ token }, { status: "Completed" });
//   res.json({ message: `Token ${token} marked as completed` });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
