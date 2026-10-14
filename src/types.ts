export type InventoryCategory = 'Fridge' | 'Freezer' | 'Pantry' | 'Spices';

export type ExpiryStatus = 'today' | 'soon' | 'fresh';

export interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  category: InventoryCategory;
  quantity: string;
  addedDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status?: ExpiryStatus;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  image: string; // large emoji or visual icon
  time: string; // e.g. "15 min"
  timeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
  cuisine: string;
  isVegetarian?: boolean;
  isHighProtein?: boolean;
  expiringMatch?: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  note?: string;
  emoji?: string;
}

export interface UserPreferences {
  name: string;
  email: string;
  householdSize: number;
  dietaryRestrictions: string[];
  cookingTime: string;
  notifications: {
    expiryAlerts: boolean;
    weeklyPlan: boolean;
    monthlyReport: boolean;
  };
  streak: number;
  joinedDate: string;
}

export interface ImpactMetrics {
  moneySaved: number;
  foodSaved: number; // in kg
  co2Avoided: number; // in kg
  waterSaved: number; // in Liters
  wasteStreak: number; // in days
}

export interface CookedRecipeRecord {
  id: string;
  recipeId: string;
  recipeName: string;
  date: string;
  moneySaved: number;
  foodSaved: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  bgColor: string;
  isCurrentUser?: boolean;
}

export interface ActivityFeedItem {
  id: string;
  userName: string;
  action: string;
  detail: string;
  timeAgo: string;
  emoji: string;
}
