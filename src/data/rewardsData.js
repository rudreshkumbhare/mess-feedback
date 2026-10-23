// Reward and Gamification configuration

export const REWARD_RULES = {
  PER_RATING: 10,
  PER_COMMENT: 5,
  MEAL_COMPLETION_BONUS: 20,
};

export const REWARDS_CATALOG = [
  {
    id: 'rew-1',
    title: 'Hot Chai / Coffee Voucher',
    description: 'Valid at the hostel night canteen after 10 PM.',
    pointsCost: 50,
    category: 'Beverage',
    code: 'MESS-CHAI-8831',
  },
  {
    id: 'rew-2',
    title: 'Weekend Dessert Token',
    description: 'Extra portion of Gulab Jamun or Ice Cream on Sunday.',
    pointsCost: 100,
    category: 'Food',
    code: 'MESS-SWEET-4492',
  },
  {
    id: 'rew-3',
    title: 'Festival Feast Express Pass',
    description: 'Skip the main dinner queue during monthly festival feast.',
    pointsCost: 150,
    category: 'Perk',
    code: 'MESS-PASS-1029',
  },
  {
    id: 'rew-4',
    title: 'Mess Committee Gold Reviewer Badge',
    description: 'Official monthly student dining quality committee badge.',
    pointsCost: 250,
    category: 'Badge',
    code: 'MESS-BADGE-007',
  },
];

export function getUserLevel(points) {
  if (points >= 250) {
    return { name: 'Master Taste Reviewer', level: 4, nextMilestone: 350, progress: 100 };
  }
  if (points >= 150) {
    const progress = Math.min(100, Math.round(((points - 150) / 100) * 100));
    return { name: 'Mess Critic', level: 3, nextMilestone: 250, progress };
  }
  if (points >= 50) {
    const progress = Math.min(100, Math.round(((points - 50) / 100) * 100));
    return { name: 'Active Foodie', level: 2, nextMilestone: 150, progress };
  }
  const progress = Math.min(100, Math.round((points / 50) * 100));
  return { name: 'New Diner', level: 1, nextMilestone: 50, progress };
}
