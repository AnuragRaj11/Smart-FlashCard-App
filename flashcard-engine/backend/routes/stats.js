import express from 'express';
import Card from '../models/Card.js';
import Deck from '../models/Deck.js';

const router = express.Router();

// Get stats for a specific deck
router.get('/deck/:deckId', async (req, res) => {
  try {
    const cards = await Card.find({ deckId: req.params.deckId });
    const deck = await Deck.findById(req.params.deckId);
    const now = new Date();
    
    const total = cards.length;
    const mastered = cards.filter(c => c.repetitions >= 5).length;
    const learning = cards.filter(c => c.repetitions > 0 && c.repetitions < 5).length;
    const newCards = cards.filter(c => c.repetitions === 0).length;
    const dueToday = cards.filter(c => new Date(c.nextReviewDate) <= now).length;
    const accuracy = cards.length > 0 
      ? (cards.filter(c => c.correctCount > c.incorrectCount).length / cards.length) * 100 
      : 0;
    
    res.json({
      total,
      mastered,
      learning,
      newCards,
      dueToday,
      accuracy: Math.round(accuracy),
      streak: deck?.streak || 0,
      longestStreak: deck?.longestStreak || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all decks with their stats
router.get('/decks', async (req, res) => {
  try {
    const decks = await Deck.find().sort({ createdAt: -1 });
    
    const decksWithStats = await Promise.all(decks.map(async (deck) => {
      const cards = await Card.find({ deckId: deck._id });
      const now = new Date();
      const dueToday = cards.filter(c => new Date(c.nextReviewDate) <= now).length;
      
      return {
        _id: deck._id,
        name: deck.name,
        cardCount: deck.cardCount,
        createdAt: deck.createdAt,
        dueToday,
        streak: deck.streak || 0
      };
    }));
    
    res.json(decksWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update streak when reviewing
router.post('/streak/:deckId', async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.deckId);
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastReview = new Date(deck.lastReviewed);
    lastReview.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastReview) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      deck.streak += 1;
      if (deck.streak > deck.longestStreak) {
        deck.longestStreak = deck.streak;
      }
    } else if (diffDays > 1) {
      deck.streak = 1;
    }
    
    deck.lastReviewed = today;
    await deck.save();
    
    res.json({ streak: deck.streak, longestStreak: deck.longestStreak });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;