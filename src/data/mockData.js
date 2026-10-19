// Mock menu data for the current day
export const MENU = {
  Breakfast: [
    { id: 'b1', name: 'Poha' },
    { id: 'b2', name: 'Tea' },
    { id: 'b3', name: 'Bread and Butter' },
  ],
  Lunch: [
    { id: 'l1', name: 'Chapati' },
    { id: 'l2', name: 'Dal Tadka' },
    { id: 'l3', name: 'Jeera Rice' },
    { id: 'l4', name: 'Aloo Sabzi' },
  ],
  Snacks: [
    { id: 's1', name: 'Samosa' },
    { id: 's2', name: 'Tea' },
  ],
  Dinner: [
    { id: 'd1', name: 'Paneer Masala' },
    { id: 'd2', name: 'Chapati' },
    { id: 'd3', name: 'Rice' },
    { id: 'd4', name: 'Salad' },
  ],
};

export const MEALS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

// Realistic seed data — simulates feedback from multiple students
// Each entry: { dishId, dishName, meal, rating, comment, timestamp }
export const SEED_FEEDBACK = [
  // Breakfast
  { id: 'seed-1',  dishId: 'b1', dishName: 'Poha',            meal: 'Breakfast', rating: 4, comment: 'Well seasoned, hot.',        timestamp: '2026-10-19T07:12:00+05:30' },
  { id: 'seed-2',  dishId: 'b1', dishName: 'Poha',            meal: 'Breakfast', rating: 5, comment: '',                           timestamp: '2026-10-19T07:25:00+05:30' },
  { id: 'seed-3',  dishId: 'b1', dishName: 'Poha',            meal: 'Breakfast', rating: 3, comment: 'A bit dry today.',           timestamp: '2026-10-19T07:38:00+05:30' },
  { id: 'seed-4',  dishId: 'b1', dishName: 'Poha',            meal: 'Breakfast', rating: 4, comment: '',                           timestamp: '2026-10-19T07:45:00+05:30' },
  { id: 'seed-5',  dishId: 'b2', dishName: 'Tea',             meal: 'Breakfast', rating: 3, comment: 'Lukewarm, could be hotter.', timestamp: '2026-10-19T07:15:00+05:30' },
  { id: 'seed-6',  dishId: 'b2', dishName: 'Tea',             meal: 'Breakfast', rating: 2, comment: 'Too sweet.',                 timestamp: '2026-10-19T07:22:00+05:30' },
  { id: 'seed-7',  dishId: 'b2', dishName: 'Tea',             meal: 'Breakfast', rating: 3, comment: '',                           timestamp: '2026-10-19T07:40:00+05:30' },
  { id: 'seed-8',  dishId: 'b3', dishName: 'Bread and Butter',meal: 'Breakfast', rating: 4, comment: '',                           timestamp: '2026-10-19T07:18:00+05:30' },
  { id: 'seed-9',  dishId: 'b3', dishName: 'Bread and Butter',meal: 'Breakfast', rating: 4, comment: 'Fresh bread.',               timestamp: '2026-10-19T07:30:00+05:30' },
  { id: 'seed-10', dishId: 'b3', dishName: 'Bread and Butter',meal: 'Breakfast', rating: 5, comment: '',                           timestamp: '2026-10-19T07:50:00+05:30' },

  // Lunch
  { id: 'seed-11', dishId: 'l1', dishName: 'Chapati',         meal: 'Lunch',     rating: 4, comment: '',                           timestamp: '2026-10-19T12:05:00+05:30' },
  { id: 'seed-12', dishId: 'l1', dishName: 'Chapati',         meal: 'Lunch',     rating: 3, comment: 'Hard chapatis again.',       timestamp: '2026-10-19T12:18:00+05:30' },
  { id: 'seed-13', dishId: 'l1', dishName: 'Chapati',         meal: 'Lunch',     rating: 4, comment: '',                           timestamp: '2026-10-19T12:30:00+05:30' },
  { id: 'seed-14', dishId: 'l1', dishName: 'Chapati',         meal: 'Lunch',     rating: 2, comment: 'Burnt on the edges.',        timestamp: '2026-10-19T12:45:00+05:30' },
  { id: 'seed-15', dishId: 'l2', dishName: 'Dal Tadka',       meal: 'Lunch',     rating: 5, comment: 'Excellent today!',           timestamp: '2026-10-19T12:10:00+05:30' },
  { id: 'seed-16', dishId: 'l2', dishName: 'Dal Tadka',       meal: 'Lunch',     rating: 5, comment: '',                           timestamp: '2026-10-19T12:20:00+05:30' },
  { id: 'seed-17', dishId: 'l2', dishName: 'Dal Tadka',       meal: 'Lunch',     rating: 4, comment: 'Good consistency.',         timestamp: '2026-10-19T12:35:00+05:30' },
  { id: 'seed-18', dishId: 'l2', dishName: 'Dal Tadka',       meal: 'Lunch',     rating: 5, comment: '',                           timestamp: '2026-10-19T12:50:00+05:30' },
  { id: 'seed-19', dishId: 'l3', dishName: 'Jeera Rice',      meal: 'Lunch',     rating: 4, comment: '',                           timestamp: '2026-10-19T12:08:00+05:30' },
  { id: 'seed-20', dishId: 'l3', dishName: 'Jeera Rice',      meal: 'Lunch',     rating: 4, comment: 'Nicely cooked.',            timestamp: '2026-10-19T12:22:00+05:30' },
  { id: 'seed-21', dishId: 'l3', dishName: 'Jeera Rice',      meal: 'Lunch',     rating: 3, comment: '',                           timestamp: '2026-10-19T12:40:00+05:30' },
  { id: 'seed-22', dishId: 'l4', dishName: 'Aloo Sabzi',      meal: 'Lunch',     rating: 2, comment: 'Undercooked potatoes.',      timestamp: '2026-10-19T12:12:00+05:30' },
  { id: 'seed-23', dishId: 'l4', dishName: 'Aloo Sabzi',      meal: 'Lunch',     rating: 1, comment: 'Too oily and bland.',       timestamp: '2026-10-19T12:28:00+05:30' },
  { id: 'seed-24', dishId: 'l4', dishName: 'Aloo Sabzi',      meal: 'Lunch',     rating: 2, comment: '',                           timestamp: '2026-10-19T12:44:00+05:30' },
  { id: 'seed-25', dishId: 'l4', dishName: 'Aloo Sabzi',      meal: 'Lunch',     rating: 1, comment: 'Needs more spices.',        timestamp: '2026-10-19T12:55:00+05:30' },

  // Snacks
  { id: 'seed-26', dishId: 's1', dishName: 'Samosa',          meal: 'Snacks',    rating: 5, comment: 'Crispy and hot!',           timestamp: '2026-10-19T16:05:00+05:30' },
  { id: 'seed-27', dishId: 's1', dishName: 'Samosa',          meal: 'Snacks',    rating: 5, comment: '',                           timestamp: '2026-10-19T16:12:00+05:30' },
  { id: 'seed-28', dishId: 's1', dishName: 'Samosa',          meal: 'Snacks',    rating: 4, comment: 'Great filling.',            timestamp: '2026-10-19T16:20:00+05:30' },
  { id: 'seed-29', dishId: 's2', dishName: 'Tea',             meal: 'Snacks',    rating: 3, comment: '',                           timestamp: '2026-10-19T16:08:00+05:30' },
  { id: 'seed-30', dishId: 's2', dishName: 'Tea',             meal: 'Snacks',    rating: 4, comment: 'Better than morning.',      timestamp: '2026-10-19T16:18:00+05:30' },

  // Dinner — partial (dinner just started)
  { id: 'seed-31', dishId: 'd1', dishName: 'Paneer Masala',   meal: 'Dinner',    rating: 5, comment: 'Best dish of the day!',     timestamp: '2026-10-19T19:10:00+05:30' },
  { id: 'seed-32', dishId: 'd1', dishName: 'Paneer Masala',   meal: 'Dinner',    rating: 4, comment: '',                           timestamp: '2026-10-19T19:18:00+05:30' },
  { id: 'seed-33', dishId: 'd2', dishName: 'Chapati',         meal: 'Dinner',    rating: 3, comment: 'Soft but small portions.',   timestamp: '2026-10-19T19:12:00+05:30' },
  { id: 'seed-34', dishId: 'd3', dishName: 'Rice',            meal: 'Dinner',    rating: 4, comment: '',                           timestamp: '2026-10-19T19:15:00+05:30' },
  { id: 'seed-35', dishId: 'd4', dishName: 'Salad',           meal: 'Dinner',    rating: 2, comment: 'Not fresh, wilted leaves.', timestamp: '2026-10-19T19:22:00+05:30' },
];

// Rating thresholds for quality status
export const QUALITY_THRESHOLDS = {
  good: 3.5,      // >= 3.5 is Good
  average: 2.5,   // >= 2.5 is Average, < 3.5
                  // < 2.5 is Needs Attention
};

export function getQualityStatus(avgRating) {
  if (avgRating >= QUALITY_THRESHOLDS.good) return 'good';
  if (avgRating >= QUALITY_THRESHOLDS.average) return 'average';
  return 'poor';
}

export function getQualityLabel(status) {
  if (status === 'good') return 'Good';
  if (status === 'average') return 'Average';
  return 'Needs Attention';
}
