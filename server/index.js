const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutech';

// Middleware
app.use(cors());
app.use(express.json());

// Basic model example (contact/application-style message)
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Routes
app.get('/', (req, res) => {
  res.send('EduTech API is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const created = await ContactMessage.create({ name, email, message });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error('Error creating contact message:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// Course routes
app.use('/api/courses', courseRoutes);

// Connect to MongoDB and start server
async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

start();
