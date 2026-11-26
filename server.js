require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);
let db;

app.get('/lessons', async (req, res) => {
  try {
    const lessons = await db.collection('lesson').find({}).toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

const PORT = process.env.PORT || 3000;

client.connect()
  .then(() => {
    db = client.db('after-school');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection failed:', err));