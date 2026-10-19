import { useState, useCallback } from 'react';
import Header from './components/Header';
import StudentView from './components/StudentView';
import ManagerDashboard from './components/ManagerDashboard';
import { SEED_FEEDBACK } from './data/mockData';

// Load persisted new submissions from localStorage, merge with seed
function loadFeedback() {
  try {
    const stored = localStorage.getItem('messmate_feedback');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

function saveFeedback(newSubmissions) {
  try {
    localStorage.setItem('messmate_feedback', JSON.stringify(newSubmissions));
  } catch {
    // ignore
  }
}

function loadView() {
  try {
    return localStorage.getItem('messmate_view') || 'student';
  } catch {
    return 'student';
  }
}

function saveView(view) {
  try {
    localStorage.setItem('messmate_view', view);
  } catch {
    // ignore
  }
}

export default function App() {
  const [view, setView] = useState(() => loadView());

  // newSubmissions: feedback submitted by the user in this session or prior sessions (persisted)
  const [newSubmissions, setNewSubmissions] = useState(() => loadFeedback());

  // Combine seed + user submissions for the dashboard
  const allFeedback = [...SEED_FEEDBACK, ...newSubmissions];

  // Track which dishes have been submitted (by dishId) — from persisted submissions
  const submittedDishes = new Set(newSubmissions.map((fb) => fb.dishId));

  const handleViewChange = useCallback((v) => {
    setView(v);
    saveView(v);
  }, []);

  const handleSubmit = useCallback(({ dishId, dishName, meal, rating, comment }) => {
    const entry = {
      id: `user-${Date.now()}-${dishId}`,
      dishId,
      dishName,
      meal,
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    setNewSubmissions((prev) => {
      // Prevent duplicate submission for same dishId
      if (prev.some((fb) => fb.dishId === dishId)) return prev;
      const updated = [...prev, entry];
      saveFeedback(updated);
      return updated;
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header view={view} onViewChange={handleViewChange} />
      <main>
        {view === 'student' ? (
          <StudentView submittedDishes={submittedDishes} onSubmit={handleSubmit} />
        ) : (
          <ManagerDashboard allFeedback={allFeedback} />
        )}
      </main>
    </div>
  );
}
