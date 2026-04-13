import express from 'express';
import Card from '../models/Card.js';
import { calculateNextReview } from '../utils/spacedRepetition.js';

const router = express.Router();

router.post('/:cardId', async (req, res) => {
  try {
    const { quality } = req.body; // 0-5
    const card = await Card.findById(req.params.cardId);
    
    if (!card) return res.status(404).json({ error: 'Card not found' });
    
    const updated = calculateNextReview(card, quality);
    
    card.repetitions = updated.repetitions;
    card.easeFactor = updated.easeFactor;
    card.interval = updated.interval;
    card.nextReviewDate = updated.nextReviewDate;
    card.lastReviewed = new Date();
    
    if (quality >= 3) {
      card.correctCount += 1;
    } else {
      card.incorrectCount += 1;
    }
    
    await card.save();
    
    res.json({ success: true, nextReviewDate: card.nextReviewDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;