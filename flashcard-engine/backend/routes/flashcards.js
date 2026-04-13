import express from 'express';
import Card from '../models/Card.js';
import Deck from '../models/Deck.js';

const router = express.Router();

router.get('/deck/:deckId', async (req, res) => {
  try {
    const cards = await Card.find({ deckId: req.params.deckId });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/decks/:deckId/pdf', async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.deckId);
    if (!deck || !deck.sourcePDF) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // If you saved the PDF, send it
    const pdfPath = path.join('uploads', deck.sourcePDF);
    if (fs.existsSync(pdfPath)) {
      res.sendFile(pdfPath, { root: '.' });
    } else {
      res.json({ message: 'PDF file not stored (deleted after processing)' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/due/:deckId', async (req, res) => {
  try {
    const now = new Date();
    const dueCards = await Card.find({
      deckId: req.params.deckId,
      nextReviewDate: { $lte: now }
    });
    res.json(dueCards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
