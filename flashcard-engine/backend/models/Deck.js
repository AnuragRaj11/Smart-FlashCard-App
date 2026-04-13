import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sourcePDF: { type: String },
  createdAt: { type: Date, default: Date.now },
  cardCount: { type: Number, default: 0 },
  lastReviewed: { type: Date, default: Date.now },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 }
});

export default mongoose.model('Deck', deckSchema);