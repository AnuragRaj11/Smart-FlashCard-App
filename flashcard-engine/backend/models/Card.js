import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
  front: { type: String, required: true },
  back: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  repetitions: { type: Number, default: 0 },
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 0 },
  nextReviewDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  lastReviewed: { type: Date },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 }
});

export default mongoose.model('Card', cardSchema);