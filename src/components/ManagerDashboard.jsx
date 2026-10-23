import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  MessageSquare,
  Star,
  TrendingDown,
  Users,
} from 'lucide-react';
import StarRating from './StarRating';
import { MENU, MEALS, getQualityStatus, getQualityLabel } from '../data/mockData';

// Derive per-dish aggregate stats from feedback list
function computeDishStats(allFeedback) {
  const map = {}; // dishId -> { dishId, dishName, meal, ratings[], comments[] }

  allFeedback.forEach((fb) => {
    if (!map[fb.dishId]) {
      map[fb.dishId] = {
        dishId: fb.dishId,
        dishName: fb.dishName,
        meal: fb.meal,
        ratings: [],
        comments: [],
      };
    }
    map[fb.dishId].ratings.push(fb.rating);
    if (fb.comment) map[fb.dishId].comments.push(fb.comment);
  });

  return Object.values(map).map((d) => {
    const avg = d.ratings.reduce((a, b) => a + b, 0) / d.ratings.length;
    const avgRounded = Math.round(avg * 10) / 10;
    return {
      ...d,
      avgRating: avgRounded,
      count: d.ratings.length,
      status: getQualityStatus(avgRounded),
    };
  });
}

const STATUS_CONFIG = {
  good: {
    label: 'Good',
    dot: 'bg-green-500',
    badge: 'bg-green-50 text-green-700 border-green-200',
    bar: 'bg-green-500',
  },
  average: {
    label: 'Average',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-400',
  },
  poor: {
    label: 'Needs Attention',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    bar: 'bg-red-500',
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.average;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, color = 'slate' }) {
  const colors = {
    slate: 'text-slate-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-500',
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-semibold mt-1 ${colors[color]}`}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-slate-50 ${colors[color]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ManagerDashboard({ allFeedback }) {
  const [mealFilter, setMealFilter] = useState('All');

  const dishStats = useMemo(() => computeDishStats(allFeedback), [allFeedback]);

  const filteredStats = useMemo(
    () =>
      mealFilter === 'All'
        ? dishStats
        : dishStats.filter((d) => d.meal === mealFilter),
    [dishStats, mealFilter]
  );

  // Summary metrics
  const totalSubmissions = allFeedback.length;
  const overallAvg =
    dishStats.length > 0
      ? Math.round((dishStats.reduce((acc, d) => acc + d.avgRating, 0) / dishStats.length) * 10) / 10
      : 0;
  const needsAttentionCount = dishStats.filter((d) => d.status === 'poor').length;
  const totalDishesRated = dishStats.length;
  const totalPointsAwarded = allFeedback.reduce((acc, fb) => acc + 10 + (fb.comment ? 5 : 0), 0);

  // Lowest-rated dishes (bottom 3, must have poor or average status)
  const lowestRated = [...dishStats]
    .sort((a, b) => a.avgRating - b.avgRating)
    .slice(0, 3)
    .filter((d) => d.avgRating < 3.5);

  // Recent feedback (last 8, sorted by timestamp desc)
  const recentFeedback = [...allFeedback]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Manager Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time food quality overview — today, {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <SummaryCard
          icon={Users}
          label="Submissions"
          value={totalSubmissions}
          sub="student reviews"
          color="slate"
        />
        <SummaryCard
          icon={Star}
          label="Overall Avg"
          value={overallAvg > 0 ? `${overallAvg}/5` : '—'}
          sub="across all dishes"
          color={overallAvg >= 3.5 ? 'green' : overallAvg >= 2.5 ? 'amber' : 'red'}
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Needs Attention"
          value={needsAttentionCount}
          sub={needsAttentionCount === 1 ? 'dish' : 'dishes'}
          color={needsAttentionCount > 0 ? 'red' : 'green'}
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Dishes Rated"
          value={totalDishesRated}
          sub="unique dishes"
          color="slate"
        />
        <SummaryCard
          icon={Award}
          label="Points Given"
          value={`${totalPointsAwarded}`}
          sub="reward tokens"
          color="amber"
        />
      </div>

      {/* Lowest-rated highlight */}
      {lowestRated.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-red-800">Lowest-Rated Dishes Today</h2>
          </div>
          <div className="space-y-2">
            {lowestRated.map((dish) => (
              <div key={dish.dishId} className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 border border-red-100">
                <div>
                  <span className="text-sm font-medium text-slate-900">{dish.dishName}</span>
                  <span className="ml-2 text-xs text-slate-400">{dish.meal}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating value={Math.round(dish.avgRating)} readonly size="sm" />
                  <span className="text-sm font-semibold text-red-600">{dish.avgRating}</span>
                  <StatusBadge status={dish.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dish rating overview */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Header + filter */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Dish Rating Overview</h2>
          {/* Meal filter */}
          <div className="flex items-center gap-1.5">
            {['All', ...MEALS].map((m) => (
              <button
                key={m}
                onClick={() => setMealFilter(m)}
                className={[
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-100',
                  mealFilter === m
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100',
                ].join(' ')}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Table — desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Dish</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Meal</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Rating</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Ratings</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStats.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-sm">
                    No feedback data for this filter.
                  </td>
                </tr>
              )}
              {filteredStats
                .sort((a, b) => a.avgRating - b.avgRating)
                .map((dish) => {
                  const cfg = STATUS_CONFIG[dish.status] || STATUS_CONFIG.average;
                  const barWidth = Math.round((dish.avgRating / 5) * 100);
                  return (
                    <tr
                      key={dish.dishId}
                      className={[
                        'hover:bg-slate-50 transition-colors',
                        dish.status === 'poor' ? 'bg-red-50/30' : '',
                      ].join(' ')}
                    >
                      <td className="px-5 py-3 font-medium text-slate-900">{dish.dishName}</td>
                      <td className="px-4 py-3 text-slate-500">{dish.meal}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StarRating value={Math.round(dish.avgRating)} readonly size="sm" />
                          <span className="font-medium text-slate-700">{dish.avgRating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{dish.count}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={dish.status} />
                      </td>
                      <td className="px-4 py-3 w-28">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${cfg.bar} transition-all duration-500`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div className="sm:hidden divide-y divide-slate-100">
          {filteredStats.length === 0 && (
            <p className="px-4 py-8 text-center text-slate-400 text-sm">No feedback data.</p>
          )}
          {filteredStats
            .sort((a, b) => a.avgRating - b.avgRating)
            .map((dish) => {
              const cfg = STATUS_CONFIG[dish.status] || STATUS_CONFIG.average;
              const barWidth = Math.round((dish.avgRating / 5) * 100);
              return (
                <div
                  key={dish.dishId}
                  className={`px-4 py-3 ${dish.status === 'poor' ? 'bg-red-50/40' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{dish.dishName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{dish.meal} · {dish.count} ratings</p>
                    </div>
                    <StatusBadge status={dish.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating value={Math.round(dish.avgRating)} readonly size="sm" />
                    <span className="text-sm font-medium text-slate-700">{dish.avgRating}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${cfg.bar}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Recent feedback */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <MessageSquare size={15} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">Recent Feedback</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentFeedback.length === 0 && (
            <p className="px-5 py-8 text-center text-slate-400 text-sm">No feedback submitted yet.</p>
          )}
          {recentFeedback.map((fb) => (
            <div key={fb.id} className="px-5 py-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900 text-sm">{fb.dishName}</span>
                  <span className="text-xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">{fb.meal}</span>
                </div>
                {fb.comment && (
                  <p className="text-xs text-slate-500 mt-1 italic">"{fb.comment}"</p>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                <StarRating value={fb.rating} readonly size="sm" />
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={10} />
                  {formatTime(fb.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
