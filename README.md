# 📚 Smart Flashcard Engine

> Turn any PDF into intelligent flashcards with AI-powered spaced repetition

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen.svg)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC.svg)](https://tailwindcss.com/)

## ✨ Features

- 📄 **PDF to Flashcards** - Upload any PDF, get AI-generated flashcards instantly
- 🧠 **Spaced Repetition** - SM-2 algorithm optimizes your review schedule
- 📊 **Progress Dashboard** - Track mastery, streaks, and due cards
- 🗂️ **Deck Management** - Browse, search, and organize your flashcard decks
- 🎨 **Beautiful UI** - Dark theme with smooth animations and shine effects
- 🔥 **Study Streaks** - Stay motivated with daily streak tracking
- 📱 **Responsive Design** - Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

```

flashcard-engine/
├── backend/
│   ├── models/
│   │   ├── Deck.js          # Deck schema
│   │   └── Card.js          # Flashcard schema
│   ├── routes/
│   │   ├── upload.js        # PDF upload endpoint
│   │   ├── flashcards.js    # Flashcard CRUD
│   │   ├── review.js        # Review tracking
│   │   ├── stats.js         # Statistics endpoints
│   │   └── delete.js        # Delete operations
│   ├── utils/
│   │   ├── pdfParser.js     # PDF text extraction
│   │   ├── flashcardGenerator.js  # AI flashcard generation
│   │   └── spacedRepetition.js    # SM-2 algorithm
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeckBrowser.jsx        # Deck management
│   │   │   ├── ProgressDashboard.jsx  # Statistics display
│   │   │   └── FlashcardReview.jsx    # Review interface
│   │   ├── App.jsx          # Main app component
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Global styles
│   └── package.json
└── README.md
```
## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.

## 🙏 Acknowledgments
Cuemath for the project inspiration

SM-2 algorithm by SuperMemo

TailwindCSS for styling

MongoDB for database
