import React, { useState, useEffect, useCallback } from "react";

const FlashcardReview = ({ deck, onComplete, onBack }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/flashcards/due/${deck.deckId}`);
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  }, [deck.deckId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleRating = async (quality) => {
    const card = cards[currentIndex];
    try {
      await fetch(`http://localhost:5000/api/review/${card._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quality })
      });
      
      if (currentIndex + 1 >= cards.length) {
        onComplete();
      } else {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const getCardColor = (index) => {
    const colors = [
      "from-purple-600 to-indigo-600",
      "from-blue-600 to-cyan-600",
      "from-emerald-600 to-teal-600",
      "from-orange-600 to-red-600",
      "from-pink-600 to-rose-600",
      "from-green-600 to-lime-600",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">All Caught Up!</h2>
          <p className="text-gray-400 mb-6">No cards due for review. Come back later!</p>
          <button onClick={onComplete} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const cardColor = getCardColor(currentIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="text-gray-400 hover:text-white">← Back</button>
          <div className="text-gray-400">Card {currentIndex + 1} of {cards.length}</div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div 
            className={`relative bg-gradient-to-br ${cardColor} rounded-2xl shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105 overflow-hidden`}
            style={{ minHeight: "380px", aspectRatio: "16/10" }}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            </div>
            
            <div className="flex items-center justify-center h-full p-12">
              <div className="text-center w-full">
                {!flipped ? (
                  <>
                    <div className="text-sm text-white/60 mb-4">Question</div>
                    <div className="text-2xl md:text-3xl text-white font-medium">{currentCard.front}</div>
                    <div className="mt-8 text-white/40 text-sm">Click to reveal answer</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-white/60 mb-4">Answer</div>
                    <div className="text-xl md:text-2xl text-white leading-relaxed">{currentCard.back}</div>
                    <div className="mt-6 text-white/40 text-sm">How well did you know this?</div>
                    <div className="flex gap-3 justify-center mt-4">
                      <button onClick={(e) => { e.stopPropagation(); handleRating(0); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Forgot</button>
                      <button onClick={(e) => { e.stopPropagation(); handleRating(3); }} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg">Hard</button>
                      <button onClick={(e) => { e.stopPropagation(); handleRating(5); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Easy</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardReview;