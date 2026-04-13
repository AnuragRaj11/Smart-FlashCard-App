import React, { useState, useEffect, useCallback } from "react";
import API_URL from "../config.js";

const ProgressDashboard = ({ deckId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/stats/deck/${deckId}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId) {
      fetchStats();
    }
  }, [fetchStats, deckId]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="text-center text-gray-400">Loading stats...</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <h3 className="text-white font-semibold mb-4 text-center">📊 Progress Dashboard</h3>
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-orange-900/30 px-4 py-2 rounded-full">
          <span className="text-2xl">🔥</span>
          <span className="text-orange-400 font-bold text-xl">{stats.streak || 0}</span>
          <span className="text-gray-400">day streak</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{stats.total || 0}</div>
          <div className="text-gray-400 text-xs">Total Cards</div>
        </div>
        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{stats.mastered || 0}</div>
          <div className="text-gray-400 text-xs">Mastered</div>
        </div>
        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">{stats.learning || 0}</div>
          <div className="text-gray-400 text-xs">Learning</div>
        </div>
        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{stats.dueToday || 0}</div>
          <div className="text-gray-400 text-xs">Due Today</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Mastery Progress</span>
          <span>{Math.round(((stats.mastered || 0) / (stats.total || 1)) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((stats.mastered || 0) / (stats.total || 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;