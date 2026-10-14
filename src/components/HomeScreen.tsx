import React, { useState } from 'react';
import { Bell, Flame, ChevronRight, Sparkles, Clock, AlertTriangle, ArrowUpRight, CheckCircle2, Smartphone } from 'lucide-react';
import { InventoryItem, Recipe, ImpactMetrics, UserPreferences } from '../types';
import { getTimeOfDayGreeting, getDaysRemaining, formatExpiryLabel, calculateRecipeMatch } from '../utils/helpers';

interface HomeScreenProps {
  preferences: UserPreferences;
  inventory: InventoryItem[];
  recipes: Recipe[];
  impact: ImpactMetrics;
  onOpenRecipeDetail: (recipe: Recipe) => void;
  onNavigateToTab: (tab: 'home' | 'inventory' | 'recipes' | 'shopping' | 'profile') => void;
  onOpenImpactDashboard: () => void;
  onOpenScanner: () => void;
  onOpenInstallModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  preferences,
  inventory,
  recipes,
  impact,
  onOpenRecipeDetail,
  onNavigateToTab,
  onOpenImpactDashboard,
  onOpenScanner,
  onOpenInstallModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Expiring items (≤ 3 days)
  const expiringItems = inventory
    .filter(item => getDaysRemaining(item.expiryDate) <= 3)
    .sort((a, b) => getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate));

  // Matched recipes ranked by (expiring matches * 2) + total matches
  const rankedRecipes = recipes
    .map(recipe => calculateRecipeMatch(recipe, inventory))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  const greeting = getTimeOfDayGreeting();

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4CAF50]">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{preferences.streak || 12} Day Zero-Waste Streak!</span>
          </div>
          <h1 className="text-xl font-bold text-[#2C3E50] tracking-tight mt-0.5">
            {greeting}, {preferences.name || 'Chef'} 👋
          </h1>
          <p className="text-xs text-[#7F8C8D]">
            {expiringItems.length > 0 ? (
              <span>You have <strong className="text-[#FF6B6B] font-bold">{expiringItems.length} items</strong> expiring soon</span>
            ) : (
              <span className="text-emerald-600 font-medium">All ingredients are fresh and safe! ✨</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* APK / Install Button */}
          <button
            onClick={onOpenInstallModal}
            className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
            aria-label="Install app or download APK"
            title="Download APK / Install"
          >
            <Smartphone className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="View kitchen alerts"
            >
              <Bell className="w-5 h-5" />
              {expiringItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF6B6B] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Quick Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3.5 z-30 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Kitchen Alerts</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {expiringItems.length > 0 ? (
                    expiringItems.map(item => {
                      const expiry = formatExpiryLabel(item.expiryDate);
                      return (
                        <div key={item.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-amber-50/60">
                          <div className="flex items-center gap-2">
                            <span>{item.emoji}</span>
                            <span className="font-medium text-slate-800 truncate max-w-[120px]">{item.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-700">{expiry.text}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-2">No urgent alerts today. You are all caught up!</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToTab('inventory');
                  }}
                  className="w-full mt-2 py-1.5 text-center text-xs font-bold text-[#4CAF50] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  Manage in Inventory →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Camera Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-4 text-white shadow-md shadow-emerald-700/15">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Fast AI Scan</p>
          <h2 className="text-base font-bold">Bought new groceries?</h2>
          <p className="text-xs text-emerald-100/90">Scan your fridge or receipt to update inventory</p>
        </div>
        <button
          onClick={onOpenScanner}
          className="px-3.5 py-2.5 bg-white text-emerald-800 rounded-2xl text-xs font-bold shadow-sm hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Scan Fridge</span>
        </button>
      </div>

      {/* SECTION: EXPIRING SOON (Horizontal Scroll) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-[#2C3E50]">Expiring Soon</h2>
            <span className="text-[11px] font-semibold text-slate-400">({expiringItems.length})</span>
          </div>
          <button
            onClick={() => onNavigateToTab('inventory')}
            className="text-xs text-[#4CAF50] font-semibold flex items-center hover:underline cursor-pointer"
          >
            <span>See all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {expiringItems.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 -mx-4 px-4 no-scrollbar">
            {expiringItems.slice(0, 5).map((item) => {
              const expiry = formatExpiryLabel(item.expiryDate);
              // Find first recipe using this item
              const matchingRecipe = recipes.find(r =>
                r.ingredients.some(ing => ing.toLowerCase().includes(item.name.toLowerCase().replace(/fresh|sweet|ripe|baby/g, '').trim()))
              );

              return (
                <div
                  key={item.id}
                  className="shrink-0 w-36 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl border border-amber-100">
                        {item.emoji}
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${expiry.badgeClass}`}>
                        {getDaysRemaining(item.expiryDate) <= 0 ? 'Today' : `${getDaysRemaining(item.expiryDate)}d`}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">{item.quantity}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (matchingRecipe) {
                        onOpenRecipeDetail(matchingRecipe);
                      } else {
                        onNavigateToTab('recipes');
                      }
                    }}
                    className="mt-3 w-full py-1.5 text-center text-[11px] font-bold text-white bg-[#4CAF50] hover:bg-emerald-600 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    Cook This
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
            <span className="text-2xl">🎉</span>
            <p className="text-xs font-bold text-emerald-900 mt-1">All fresh!</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Nothing is expiring in the next 3 days. Great kitchen rhythm!</p>
          </div>
        )}
      </div>

      {/* SECTION: WHAT CAN I COOK TONIGHT? */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🍳</span>
            <h2 className="text-sm font-bold text-[#2C3E50]">What Can I Cook Tonight?</h2>
          </div>
          <button
            onClick={() => onNavigateToTab('recipes')}
            className="text-xs text-[#4CAF50] font-semibold flex items-center hover:underline cursor-pointer"
          >
            <span>All recipes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {rankedRecipes.map(({ recipe, matchedIngredients, expiringMatches }) => (
            <div
              key={recipe.id}
              onClick={() => onOpenRecipeDetail(recipe)}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center gap-3.5 hover:border-emerald-300 transition-all cursor-pointer group active:scale-[0.99]"
            >
              {/* Recipe Emoji Icon */}
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                {recipe.image || recipe.emoji}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#2C3E50] truncate group-hover:text-[#4CAF50] transition-colors">
                    {recipe.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {recipe.time}
                  </span>
                  <span>·</span>
                  <span>{recipe.difficulty}</span>
                  <span>·</span>
                  <span className="font-semibold text-emerald-700">{matchedIngredients.length}/{recipe.ingredients.length} on hand</span>
                </div>

                {/* Expiring Badge */}
                {expiringMatches.length > 0 && (
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B5E20] bg-[#A8E6CF]/40 border border-[#A8E6CF] px-2 py-0.5 rounded-md">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-700" />
                      Uses {expiringMatches.length} expiring item{expiringMatches.length > 1 ? 's' : ''}!
                    </span>
                  </div>
                )}
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: IMPACT CARD (Clickable to Screen 7) */}
      <div
        onClick={onOpenImpactDashboard}
        className="bg-[#FFF8E7] rounded-3xl p-4 border border-amber-200/80 shadow-sm cursor-pointer hover:shadow-md transition-all group"
      >
        <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🌱</span>
            <span className="text-xs font-bold text-[#2C3E50] uppercase tracking-wide">Your Eco & Wallet Impact</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 text-center">
          <div className="bg-white/80 rounded-2xl p-2 border border-amber-100">
            <p className="text-[10px] text-slate-500 font-medium">💰 Saved</p>
            <p className="text-sm font-extrabold text-[#2C3E50] mt-0.5 tabular-nums">
              ${impact.moneySaved}
            </p>
          </div>
          <div className="bg-white/80 rounded-2xl p-2 border border-amber-100">
            <p className="text-[10px] text-slate-500 font-medium">🥬 Rescued</p>
            <p className="text-sm font-extrabold text-[#2C3E50] mt-0.5 tabular-nums">
              {impact.foodSaved.toFixed(1)} kg
            </p>
          </div>
          <div className="bg-white/80 rounded-2xl p-2 border border-amber-100">
            <p className="text-[10px] text-slate-500 font-medium">🌱 CO₂ Avoided</p>
            <p className="text-sm font-extrabold text-[#2C3E50] mt-0.5 tabular-nums">
              {impact.co2Avoided.toFixed(1)} kg
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
