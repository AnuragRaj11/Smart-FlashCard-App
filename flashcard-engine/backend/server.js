import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import flashcardRoutes from './routes/flashcards.js';
import reviewRoutes from './routes/review.js';
import statsRoutes from './routes/stats.js';
import deleteRoutes from './routes/delete.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/upload', uploadRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/delete', deleteRoutes);

app.get('/api/decks', async (req, res) => {
  try {
    const Deck = (await import('./models/Deck.js')).default;
    const decks = await Deck.find().sort({ createdAt: -1 });
    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});