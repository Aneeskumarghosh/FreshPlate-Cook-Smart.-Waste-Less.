import { InventoryItem, Recipe, ExpiryStatus } from '../types';

/**
 * Returns difference in days between target date (YYYY-MM-DD) and today.
 * Positive = future, 0 = today, negative = expired.
 */
export function getDaysRemaining(dateString: string): number {
  if (!dateString) return 999;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return 999;
  
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Categorizes an item based on its expiry date
 */
export function getExpiryStatus(dateString: string): ExpiryStatus {
  const days = getDaysRemaining(dateString);
  if (days <= 0) return 'today';
  if (days <= 3) return 'soon';
  return 'fresh';
}

/**
 * Formats the days remaining for display badge
 */
export function formatExpiryLabel(dateString: string): { text: string; status: ExpiryStatus; badgeClass: string } {
  const days = getDaysRemaining(dateString);
  if (days < 0) {
    return {
      text: `Expired (${Math.abs(days)}d ago)`,
      status: 'today',
      badgeClass: 'bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30'
    };
  }
  if (days === 0) {
    return {
      text: 'Expires Today',
      status: 'today',
      badgeClass: 'bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30'
    };
  }
  if (days === 1) {
    return {
      text: '1 day left',
      status: 'soon',
      badgeClass: 'bg-[#FFB74D]/20 text-[#D97706] border border-[#FFB74D]/40'
    };
  }
  if (days <= 3) {
    return {
      text: `${days} days left`,
      status: 'soon',
      badgeClass: 'bg-[#FFB74D]/20 text-[#D97706] border border-[#FFB74D]/40'
    };
  }
  return {
    text: `${days} days left`,
    status: 'fresh',
    badgeClass: 'bg-[#A8E6CF]/30 text-[#1B5E20] border border-[#A8E6CF]/60'
  };
}

/**
 * Formats a date relative to today or standard format
 */
export function getTodayDateString(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if an inventory item matches an ingredient keyword
 */
export function ingredientMatches(recipeIngredient: string, inventoryItemName: string): boolean {
  const ing = recipeIngredient.toLowerCase().trim();
  const item = inventoryItemName.toLowerCase().trim();

  // Clean common modifiers
  const clean = (s: string) => s.replace(/fresh|large|medium|small|cloves?|slices?|cans?|cups?|bunch|punnet|head|bags?|stalks?|ripe/g, '').trim();
  
  const cleanIng = clean(ing);
  const cleanItem = clean(item);

  if (ing.includes(cleanItem) || item.includes(cleanIng)) return true;

  // Specific kitchen synonyms & root matches
  const synonyms: Record<string, string[]> = {
    egg: ['eggs', 'egg'],
    eggs: ['egg', 'eggs'],
    milk: ['dairy', 'milk', 'whole milk', 'oat milk'],
    cheese: ['cheddar', 'mozzarella', 'parmesan', 'feta', 'cheese'],
    pasta: ['fusilli', 'spaghetti', 'penne', 'macaroni', 'noodles', 'pasta'],
    bread: ['sourdough', 'toast', 'loaf', 'bread'],
    tomato: ['tomatoes', 'roma tomatoes', 'cherry tomatoes', 'tomato'],
    spinach: ['baby spinach', 'spinach'],
    strawberry: ['strawberries', 'strawberry'],
    banana: ['bananas', 'banana'],
    potato: ['potatoes', 'russet potato', 'potato'],
    onion: ['scallions', 'onions', 'green onions', 'onion'],
    chicken: ['chicken breast', 'chicken', 'poultry'],
    broccoli: ['broccoli florets', 'broccoli'],
    rice: ['jasmine rice', 'white rice', 'brown rice', 'cooked rice', 'rice'],
    yogurt: ['greek yogurt', 'plain yogurt', 'yogurt'],
    avocado: ['hass avocado', 'avocados', 'avocado'],
    mushroom: ['mushrooms', 'cremini', 'mushroom'],
    garlic: ['garlic cloves', 'garlic'],
    butter: ['unsalted butter', 'butter'],
    lettuce: ['romaine', 'iceberg', 'lettuce', 'salad greens'],
    tortilla: ['tortillas', 'wrap', 'tortilla']
  };

  for (const [key, list] of Object.entries(synonyms)) {
    const ingHasKey = list.some(k => ing.includes(k));
    const itemHasKey = list.some(k => item.includes(k));
    if (ingHasKey && itemHasKey) return true;
  }

  return false;
}

export interface RecipeMatchInfo {
  recipe: Recipe;
  matchedIngredients: string[];
  expiringMatches: string[];
  missingIngredients: string[];
  matchScore: number;
  totalIngredientCount: number;
}

/**
 * Calculates recipe matches against current inventory
 * Score = (expiring matches * 2) + total matches
 */
export function calculateRecipeMatch(recipe: Recipe, inventory: InventoryItem[]): RecipeMatchInfo {
  const matchedIngredients: string[] = [];
  const expiringMatches: string[] = [];
  const missingIngredients: string[] = [];

  recipe.ingredients.forEach(ingredient => {
    const matchingItem = inventory.find(item => ingredientMatches(ingredient, item.name));
    if (matchingItem) {
      matchedIngredients.push(ingredient);
      const days = getDaysRemaining(matchingItem.expiryDate);
      if (days <= 3) {
        expiringMatches.push(ingredient);
      }
    } else {
      missingIngredients.push(ingredient);
    }
  });

  const matchScore = (expiringMatches.length * 2) + matchedIngredients.length;

  return {
    recipe: {
      ...recipe,
      expiringMatch: expiringMatches.length
    },
    matchedIngredients,
    expiringMatches,
    missingIngredients,
    matchScore,
    totalIngredientCount: recipe.ingredients.length
  };
}

/**
 * Helper to get time of day greeting
 */
export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Parse numeric quantity string (e.g. "2 pcs" -> 2)
 */
export function decrementItemQuantity(quantity: string): { newQuantity: string; shouldRemove: boolean } {
  const match = quantity.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (!match) {
    return { newQuantity: '', shouldRemove: true };
  }
  const num = parseFloat(match[1]);
  const unit = match[2] || '';
  if (num <= 1) {
    return { newQuantity: '', shouldRemove: true };
  }
  const nextNum = Math.round((num - 1) * 10) / 10;
  return { newQuantity: `${nextNum} ${unit}`.trim(), shouldRemove: false };
}
