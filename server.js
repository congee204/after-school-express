require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');                      
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// logger middleware (runs for every request)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${Date.now() - start}ms`);
  });
  next();
});

// static file middleware for lesson images
app.use('/images', express.static(path.join(__dirname, 'images')));

// runs only if no image file matched above
app.use('/images', (req, res) => {
  res.status(404).json({ error: 'Image not found' });
});

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