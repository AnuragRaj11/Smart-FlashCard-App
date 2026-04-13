import express from 'express';
import multer from 'multer';
import { parsePDF } from '../utils/pdfParser.js';
import { generateFlashcards } from '../utils/flashcardGenerator.js';
import Deck from '../models/Deck.js';
import Card from '../models/Card.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No PDF uploaded' });
    
    const { text } = await parsePDF(file.path);
    const flashcards = await generateFlashcards(text);
    
    const deck = new Deck({
      name: req.body.deckName || file.originalname.replace('.pdf', ''),
      sourcePDF: file.originalname,
      streak: 0,
      longestStreak: 0,
      lastReviewed: new Date()
    });
    await deck.save();
    
    const cards = await Card.insertMany(
      flashcards.map(card => ({
        ...card,
        deckId: deck._id,
        correctCount: 0,
        incorrectCount: 0
      }))
    );
    
    deck.cardCount = cards.length;
    await deck.save();
    
    fs.unlinkSync(file.path);
    
    res.json({
      success: true,
      deckId: deck._id,
      deckName: deck.name,
      cardCount: cards.length,
      cards: cards.map(c => ({ id: c._id, front: c.front, back: c.back }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;