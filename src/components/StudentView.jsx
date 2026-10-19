import { useState } from 'react';
import { CheckCircle2, ChevronRight, MessageSquare, Send, Utensils } from 'lucide-react';
import StarRating from './StarRating';
import { MENU, MEALS } from '../data/mockData';

const MEAL_ICONS = {
  Breakfast: '☀',
  Lunch: '☽',
  Snacks: '◈',
  Dinner: '★',
};

const MEAL_TIME = {
  Breakfast: '7:30 – 9:00 AM',
  Lunch: '12:00 – 2:00 PM',
  Snacks: '4:30 – 5:30 PM',
  Dinner: '7:30 – 9:30 PM',
};

export default function StudentView({ submittedDishes, onSubmit }) {
  const [activeMeal, setActiveMeal] = useState('Breakfast');
  const [ratings, setRatings] = useState({});        // dishId -> rating
  const [comments, setComments] = useState({});       // dishId -> comment
  const [openComment, setOpenComment] = useState({}); // dishId -> bool
  const [justSubmitted, setJustSubmitted] = useState({}); // dishId -> bool (flash)

  const dishes = MENU[activeMeal] || [];

  const handleRating = (dishId, value) => {
    if (submittedDishes.has(dishId)) return;
    setRatings((prev) => ({ ...prev, [dishId]: value }));
  };

  const handleComment = (dishId, value) => {
    setComments((prev) => ({ ...prev, [dishId]: value }));
  };

  const toggleComment = (dishId) => {
    if (submittedDishes.has(dishId)) return;
    setOpenComment((prev) => ({ ...prev, [dishId]: !prev[dishId] }));
  };

  const handleSubmitDish = (dish) => {
    const rating = ratings[dish.id];
    if (!rating || submittedDishes.has(dish.id)) return;

    onSubmit({
      dishId: dish.id,
      dishName: dish.name,
      meal: activeMeal,
      rating,
      comment: comments[dish.id] || '',
    });

    setJustSubmitted((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setJustSubmitted((prev) => ({ ...prev, [dish.id]: false }));
    }, 2000);
  };

  const mealRatedCount = dishes.filter((d) => submittedDishes.has(d.id)).length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Rate Today's Meals</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a meal and rate each dish. Your feedback helps improve food quality.
        </p>
      </div>

      {/* Meal tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {MEALS.map((meal) => {
          const mealDishes = MENU[meal] || [];
          const rated = mealDishes.filter((d) => submittedDishes.has(d.id)).length;
          const allRated = rated === mealDishes.length && mealDishes.length > 0;
          const isActive = meal === activeMeal;

          return (
            <button
              key={meal}
              onClick={() => setActiveMeal(meal)}
              className={[
                'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150',
                isActive
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900',
              ].join(' ')}
            >
              {meal}
              {allRated && (
                <CheckCircle2 size={14} className={isActive ? 'text-green-200' : 'text-green-500'} />
              )}
              {!allRated && rated > 0 && (
                <span className={[
                  'text-xs rounded-full px-1.5 py-0',
                  isActive ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500',
                ].join(' ')}>
                  {rated}/{mealDishes.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Meal info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-medium text-slate-900 text-base">{activeMeal}</h2>
          <p className="text-xs text-slate-400">{MEAL_TIME[activeMeal]}</p>
        </div>
        {mealRatedCount > 0 && (
          <span className="text-xs text-slate-400">
            {mealRatedCount} of {dishes.length} rated
          </span>
        )}
      </div>

      {/* Dish cards */}
      {dishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Utensils size={32} className="text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No dishes available</p>
          <p className="text-sm text-slate-400 mt-1">Check back later for the menu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dishes.map((dish) => {
            const isSubmitted = submittedDishes.has(dish.id);
            const currentRating = ratings[dish.id] || 0;
            const hasRating = currentRating > 0;
            const flashSuccess = justSubmitted[dish.id];

            return (
              <div
                key={dish.id}
                className={[
                  'bg-white rounded-xl border px-4 py-4 transition-all duration-150',
                  isSubmitted
                    ? 'border-green-200 bg-green-50/40'
                    : 'border-slate-200 hover:border-slate-300',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Dish info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">{dish.name}</span>
                      {isSubmitted && (
                        <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                      )}
                    </div>

                    {/* Star rating */}
                    <div className="mt-2">
                      <StarRating
                        value={isSubmitted ? (ratings[dish.id] || 0) : currentRating}
                        onChange={(val) => handleRating(dish.id, val)}
                        readonly={isSubmitted}
                        size="md"
                      />
                    </div>

                    {/* Comment toggle + field */}
                    {!isSubmitted && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => toggleComment(dish.id)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <MessageSquare size={12} />
                          {openComment[dish.id] ? 'Hide comment' : 'Add comment (optional)'}
                        </button>
                        {openComment[dish.id] && (
                          <textarea
                            value={comments[dish.id] || ''}
                            onChange={(e) => handleComment(dish.id, e.target.value)}
                            placeholder="Any specific feedback..."
                            maxLength={200}
                            rows={2}
                            className="mt-2 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          />
                        )}
                      </div>
                    )}

                    {/* Submitted comment display */}
                    {isSubmitted && comments[dish.id] && (
                      <p className="mt-1.5 text-xs text-slate-500 italic">"{comments[dish.id]}"</p>
                    )}
                  </div>

                  {/* Submit button */}
                  <div className="flex-shrink-0 mt-1">
                    {isSubmitted ? (
                      <div className={[
                        'flex items-center gap-1 text-xs font-medium transition-all duration-300',
                        flashSuccess ? 'text-green-600' : 'text-green-500',
                      ].join(' ')}>
                        {flashSuccess && <span className="text-green-600">Submitted</span>}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSubmitDish(dish)}
                        disabled={!hasRating}
                        className={[
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                          hasRating
                            ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                        ].join(' ')}
                      >
                        <Send size={12} />
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Success banner */}
      {mealRatedCount === dishes.length && dishes.length > 0 && (
        <div className="mt-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">All {activeMeal.toLowerCase()} dishes rated</p>
            <p className="text-xs text-green-600 mt-0.5">Switch to another meal to continue rating.</p>
          </div>
        </div>
      )}
    </div>
  );
}
