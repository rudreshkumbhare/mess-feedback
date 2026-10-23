import { useState, useCallback } from 'react';
import Header from './components/Header';
import StudentView from './components/StudentView';
import ManagerDashboard from './components/ManagerDashboard';
import RewardsModal from './components/RewardsModal';
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

function loadPoints() {
  try {
    const stored = localStorage.getItem('messmate_points');
    if (stored !== null) return parseInt(stored, 10);
  } catch {
    // ignore
  }
  return 75; // Starting balance to immediately showcase perks
}

function savePoints(points) {
  try {
    localStorage.setItem('messmate_points', points.toString());
  } catch {
    // ignore
  }
}

function loadRedeemed() {
  try {
    const stored = localStorage.getItem('messmate_redeemed');
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

function saveRedeemed(redeemed) {
  try {
    localStorage.setItem('messmate_redeemed', JSON.stringify(redeemed));
  } catch {
    // ignore
  }
}

export default function App() {
  const [view, setView] = useState(() => loadView());
  const [points, setPoints] = useState(() => loadPoints());
  const [redeemedIds, setRedeemedIds] = useState(() => loadRedeemed());
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);

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

  const handleSubmit = useCallback(({ dishId, dishName, meal, rating, comment, pointsEarned }) => {
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

    // Award Points
    setPoints((prev) => {
      const updated = prev + (pointsEarned || 10);
      savePoints(updated);
      return updated;
    });
  }, []);

  const handleRedeem = useCallback((reward) => {
    setPoints((prev) => {
      if (prev < reward.pointsCost) return prev;
      const updated = prev - reward.pointsCost;
      savePoints(updated);
      return updated;
    });

    setRedeemedIds((prev) => {
      const updated = [...prev, reward.id];
      saveRedeemed(updated);
      return updated;
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        view={view} 
        onViewChange={handleViewChange} 
        points={points} 
        onOpenRewards={() => setIsRewardsOpen(true)} 
      />
      
      <main>
        {view === 'student' ? (
          <StudentView 
            submittedDishes={submittedDishes} 
            onSubmit={handleSubmit} 
            points={points}
            onOpenRewards={() => setIsRewardsOpen(true)}
          />
        ) : (
          <ManagerDashboard allFeedback={allFeedback} />
        )}
      </main>

      {/* Rewards & Redemption Modal */}
      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        points={points}
        redeemedIds={redeemedIds}
        onRedeem={handleRedeem}
      />
    </div>
  );
}
