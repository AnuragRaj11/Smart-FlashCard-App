import React, { useState, useEffect } from "react";
import DeckBrowser from "./components/DeckBrowser.jsx";
import ProgressDashboard from "./components/ProgressDashboard.jsx";
import FlashcardReview from "./components/FlashcardReview.jsx";
import API_URL from "./config.js";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [view, setView] = useState("home");
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/decks`);
      const data = await res.json();
      setDecks(data);
    } catch (error) {
      console.error("Failed to fetch decks:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      setCurrentDeck({ deckId: data.deckId, name: data.deckName });
      fetchDecks();
    } catch (err) {
      alert("Backend error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showReview && currentDeck) {
    return (
      <FlashcardReview 
        deck={currentDeck} 
        onComplete={() => {
          setShowReview(false);
          fetchDecks();
        }}
        onBack={() => setShowReview(false)}
      />
    );
  }

  if (view === "decks") {
    return (
      <DeckBrowser 
        decks={decks}
        onSelectDeck={(deck) => {
          setCurrentDeck(deck);
          setView("home");
        }}
        onReview={(deck) => {
          setCurrentDeck(deck);
          setShowReview(true);
        }}
        onBack={() => setView("home")}
        refreshDecks={fetchDecks}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            📚 Smart Flashcard Engine
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Turn any PDF into intelligent flashcards with AI-powered spaced repetition
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView("home")}
            className={`px-6 py-2 rounded-lg transition-all duration-300 ${
              view === "home" 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setView("decks")}
            className={`px-6 py-2 rounded-lg transition-all duration-300 ${
              view === "decks" 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            📚 My Decks ({decks.length})
          </button>
        </div>

        {currentDeck && (
          <div className="max-w-2xl mx-auto mb-8">
            <ProgressDashboard deckId={currentDeck.deckId} />
            <button
              onClick={() => setShowReview(true)}
              className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              📖 Start Review Session
            </button>
          </div>
        )}

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Upload PDF Document</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white file:cursor-pointer hover:file:from-blue-700 hover:file:to-purple-700 transition-all duration-300"
                />
              </div>
              
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Generating Flashcards...
                  </span>
                ) : (
                  "🚀 Generate Flashcards"
                )}
              </button>

              {result && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-xl animate-slide-up">
                  <p className="text-green-400">✅ Successfully created {result.cardCount} flashcards!</p>
                  <p className="text-gray-400 text-sm mt-1">Deck: {result.deckName}</p>
                  <button
                    onClick={() => setShowReview(true)}
                    className="mt-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm"
                  >
                    Start Reviewing →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {decks.length > 0 && !result && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">📖 Recent Decks</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {decks.slice(0, 3).map(deck => (
                <div key={deck._id} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-all duration-300">
                  <h3 className="text-white font-semibold mb-1">{deck.name}</h3>
                  <p className="text-gray-400 text-xs">{deck.cardCount} cards</p>
                  <button
                    onClick={() => {
                      setCurrentDeck({ deckId: deck._id, name: deck.name });
                      setShowReview(true);
                    }}
                    className="mt-2 text-blue-400 text-sm hover:text-blue-300"
                  >
                    Review →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;