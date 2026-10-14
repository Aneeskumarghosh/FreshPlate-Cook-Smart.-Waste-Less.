import React, { useState, useMemo } from 'react';
import { Search, Heart, Clock, Sparkles, Dices, X, Zap } from 'lucide-react';
import { Recipe, InventoryItem } from '../types';
import { calculateRecipeMatch, getDaysRemaining } from '../utils/helpers';

interface RecipesScreenProps {
  recipes: Recipe[];
  inventory: InventoryItem[];
  favorites: string[];
  onToggleFavorite: (recipeId: string) => void;
  onOpenRecipeDetail: (recipe: Recipe) => void;
}

type FilterChip = 'All' | '< 15 min' | '< 30 min' | 'Vegetarian' | 'High Protein' | 'Favorites';

export const RecipesScreen: React.FC<RecipesScreenProps> = ({
  recipes,
  inventory,
  favorites,
  onToggleFavorite,
  onOpenRecipeDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('All');

  // Count items expiring in <= 1 day
  const expiringCount = inventory.filter(
    (item) => getDaysRemaining(item.expiryDate) <= 1
  ).length;

  // Recipe match calculations
  const recipesWithScores = useMemo(() => {
    return recipes.map((recipe) => calculateRecipeMatch(recipe, inventory));
  }, [recipes, inventory]);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipesWithScores
      .filter(({ recipe }) => {
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = recipe.name.toLowerCase().includes(q);
          const matchCuisine = recipe.cuisine.toLowerCase().includes(q);
          const matchIng = recipe.ingredients.some((ing) => ing.toLowerCase().includes(q));
          if (!matchName && !matchCuisine && !matchIng) return false;
        }

        // Filter chips
        if (activeFilter === '< 15 min') {
          return recipe.timeMinutes <= 15;
        }
        if (activeFilter === '< 30 min') {
          return recipe.timeMinutes <= 30;
        }
        if (activeFilter === 'Vegetarian') {
          return recipe.isVegetarian === true;
        }
        if (activeFilter === 'High Protein') {
          return recipe.isHighProtein === true;
        }
        if (activeFilter === 'Favorites') {
          return favorites.includes(recipe.id);
        }

        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [recipesWithScores, searchQuery, activeFilter, favorites]);

  // Surprise Me handler: pick a random recipe from the filtered list (or all recipes)
  const handleSurpriseMe = () => {
    const list = filteredRecipes.length > 0 ? filteredRecipes : recipesWithScores;
    if (list.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    onOpenRecipeDetail(list[randomIndex].recipe);
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2C3E50] tracking-tight">Recipes For You</h1>
          <p className="text-xs text-[#7F8C8D]">
            Smart matching based on what is in your fridge
          </p>
        </div>

        <button
          onClick={handleSurpriseMe}
          className="px-3 py-2 bg-[#FFF8E7] border border-amber-300 text-amber-900 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-amber-100 active:scale-95 transition-all cursor-pointer"
          title="Pick a random recipe"
        >
          <Dices className="w-4 h-4 text-amber-600" />
          <span>Surprise Me</span>
        </button>
      </div>

      {/* Urgency Banner */}
      {expiringCount > 0 && (
        <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Zap className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">
                {expiringCount} ingredient{expiringCount > 1 ? 's' : ''} need to be used today!
              </p>
              <p className="text-[10px] text-rose-700">Recipes below prioritize rescuing them first.</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes, ingredients, pasta..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {(['All', '< 15 min', '< 30 min', 'Vegetarian', 'High Protein', 'Favorites'] as FilterChip[]).map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveFilter(chip)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === chip
                ? 'bg-[#4CAF50] text-white shadow-sm'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {chip === 'Favorites' ? `❤️ Saved (${favorites.length})` : chip}
          </button>
        ))}
      </div>

      {/* 2-Column Grid of Recipe Cards */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredRecipes.map(({ recipe, expiringMatches, matchedIngredients }) => {
            const isFav = favorites.includes(recipe.id);

            return (
              <div
                key={recipe.id}
                onClick={() => onOpenRecipeDetail(recipe)}
                className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all cursor-pointer group relative active:scale-[0.98]"
              >
                {/* Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe.id);
                  }}
                  className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${
                    isFav
                      ? 'bg-rose-50 text-rose-500 fill-rose-500'
                      : 'bg-white/80 text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="Save to favorites"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <div>
                  {/* Recipe Emoji Hero */}
                  <div className="w-full aspect-square max-h-28 rounded-xl bg-amber-50/70 border border-amber-100/60 flex items-center justify-center text-5xl mb-2.5 group-hover:scale-105 transition-transform select-none">
                    {recipe.image || recipe.emoji}
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {recipe.name}
                  </h3>

                  {/* Subtitle / time / match */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      {recipe.time}
                    </span>
                    <span>·</span>
                    <span>{recipe.difficulty}</span>
                  </div>

                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    {matchedIngredients.length}/{recipe.ingredients.length} items in fridge
                  </p>
                </div>

                {/* Uses Expiring Badge */}
                {expiringMatches.length > 0 ? (
                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-900 bg-[#A8E6CF]/40 border border-[#A8E6CF] px-2 py-0.5 rounded-md w-full truncate">
                      <Sparkles className="w-2.5 h-2.5 shrink-0 text-emerald-700" />
                      <span className="truncate">Uses {expiringMatches.length} expiring</span>
                    </span>
                  </div>
                ) : (
                  <div className="mt-2.5 h-4" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
          <span className="text-3xl">🍳</span>
          <h3 className="text-sm font-bold text-slate-800">No matching recipes</h3>
          <p className="text-xs text-slate-500">
            Try a different search term or remove filter chips to see more delicious ideas.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('All');
            }}
            className="mt-2 text-xs font-bold text-[#4CAF50] hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
