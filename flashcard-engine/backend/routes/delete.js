import express from 'express';
import Deck from '../models/Deck.js';
import Card from '../models/Card.js';

const router = express.Router();

// Delete a single deck and all its cards
router.delete('/deck/:deckId', async (req, res) => {
  try {
    const { deckId } = req.params;
    
    console.log(`Attempting to delete deck: ${deckId}`);
    
    // Check if deck exists first
    const deck = await Deck.findById(deckId);
    if (!deck) {
      console.log('Deck not found');
      return res.status(404).json({ error: 'Deck not found' });
    }
    
    console.log(`Found deck: ${deck.name}`);
    
    // Delete all cards in this deck
    const cardsDeleted = await Card.deleteMany({ deckId: deckId });
    console.log(`Deleted ${cardsDeleted.deletedCount} cards`);
    
    // Delete the deck
    const deckDeleted = await Deck.findByIdAndDelete(deckId);
    console.log(`Deleted deck: ${deckDeleted.name}`);
    
    res.json({ 
      success: true, 
      message: `Deleted deck "${deckDeleted.name}" and ${cardsDeleted.deletedCount} flashcards`,
      cardsDeleted: cardsDeleted.deletedCount
    });
  } catch (error) {
    console.error('Delete error details:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Delete all decks and all cards
router.delete('/all', async (req, res) => {
  try {
    console.log('Deleting all decks and cards...');
    
    // Get counts before deletion
    const deckCount = await Deck.countDocuments();
    const cardCount = await Card.countDocuments();
    
    console.log(`Found ${deckCount} decks and ${cardCount} cards to delete`);
    
    // Delete everything
    const cardsDeleted = await Card.deleteMany({});
    const decksDeleted = await Deck.deleteMany({});
    
    console.log(`Deleted ${decksDeleted.deletedCount} decks and ${cardsDeleted.deletedCount} cards`);
    
    res.json({ 
      success: true, 
      message: `Deleted ${decksDeleted.deletedCount} decks and ${cardsDeleted.deletedCount} flashcards`,
      decksDeleted: decksDeleted.deletedCount,
      cardsDeleted: cardsDeleted.deletedCount
    });
  } catch (error) {
    console.error('Delete all error details:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

export default router;
