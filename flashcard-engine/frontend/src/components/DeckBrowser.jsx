import React, { useState } from "react";
import API_URL from "../config.js";

const DeckBrowser = ({ decks, onSelectDeck, onReview, onBack, refreshDecks }) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const handleDelete = async (deckId, deckName) => {
    if (window.confirm(`Delete "${deckName}" and all its flashcards?`)) {
      setDeletingId(deckId);
      try {
        const response = await fetch(`${API_URL}/api/delete/deck/${deckId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          alert(`"${deckName}" deleted successfully!`);
          refreshDecks();
        } else {
          alert("Failed to delete deck");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting deck");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("⚠️ DELETE ALL DECKS AND FLASHCARDS? This cannot be undone! ⚠️")) {
      setDeletingAll(true);
      try {
        const response = await fetch(`${API_URL}/api/delete/all`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          alert("All decks and flashcards have been deleted!");
          refreshDecks();
        } else {
          alert("Failed to delete decks");
        }
      } catch (error) {
        console.error("Delete all error:", error);
        alert("Error deleting decks");
      } finally {
        setDeletingAll(false);
      }
    }
  };

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "due") {
      return (b.dueToday || 0) - (a.dueToday || 0);
    } else if (sortBy === "cards") {
      return (b.cardCount || 0) - (a.cardCount || 0);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            📚 My Flashcard Decks
          </h1>
          {decks.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50"
            >
              {deletingAll ? "Deleting..." : "🗑️ Delete All"}
            </button>
          )}
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search decks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-purple-500"
            >
              <option value="recent">Most Recent</option>
              <option value="due">Most Due</option>
              <option value="cards">Most Cards</option>
            </select>
          </div>
        </div>

        {sortedDecks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400">No decks found</p>
            <p className="text-gray-500 text-sm mt-2">Upload a PDF to create your first deck!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {sortedDecks.map((deck) => (
              <div key={deck._id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-lg break-words flex-1">{deck.name}</h3>
                    <button
                      onClick={() => handleDelete(deck._id, deck.name)}
                      disabled={deletingId === deck._id}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 ml-2 text-lg"
                      title="Delete deck"
                    >
                      {deletingId === deck._id ? "⏳" : "🗑️"}
                    </button>
                  </div>
                  <div className="flex gap-3 text-sm text-gray-400 mb-4">
                    <span>📄 {deck.cardCount} cards</span>
                    {deck.dueToday > 0 && <span>⏰ {deck.dueToday} due</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onReview({ deckId: deck._id, name: deck.name })}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => onSelectDeck({ deckId: deck._id, name: deck.name })}
                      className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-600 transition-all duration-300"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckBrowser;
