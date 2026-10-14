/**
 * FreshPlate — Smart Waste-Free Kitchen Assistant
 * "Cook Smart. Waste Less."
 *
 * Fully interactive, 100% self-contained with localStorage persistence.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { InventoryItem, Recipe, ShoppingItem, UserPreferences, ImpactMetrics, CookedRecipeRecord } from './types';
import {
  INITIAL_INVENTORY,
  RECIPES_DATABASE,
  INITIAL_SHOPPING_LIST,
  INITIAL_PREFERENCES,
  INITIAL_IMPACT,
  FAMILY_MEMBERS,
  MOCK_ACTIVITY_FEED,
} from './data/mockData';
import { getDaysRemaining, decrementItemQuantity, getTodayDateString, ingredientMatches } from './utils/helpers';
import { ToastContainer, ToastMessage } from './components/Toast';
import { BottomNav, TabType } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './components/HomeScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { ScanScreen } from './components/ScanScreen';
import { RecipesScreen } from './components/RecipesScreen';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { ImpactScreen } from './components/ImpactScreen';
import { ShoppingScreen } from './components/ShoppingScreen';
import { FamilySharingModal } from './components/FamilySharingModal';
import { ProfileScreen } from './components/ProfileScreen';
import { InstallModal } from './components/InstallModal';

// LocalStorage Keys
const STORAGE_KEYS = {
  INVENTORY: 'freshplate_inventory',
  RECIPES_COOKED: 'freshplate_recipes_cooked',
  SHOPPING: 'freshplate_shopping',
  PREFERENCES: 'freshplate_preferences',
  IMPACT: 'freshplate_impact',
  ONBOARDED: 'freshplate_onboarded',
  FAVORITES: 'freshplate_favorites',
};

export default function App() {
  // Navigation & Screen View State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFamilySharingOpen, setIsFamilySharingOpen] = useState(false);
  const [isImpactDashboardOpen, setIsImpactDashboardOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<Recipe | null>(null);

  // Persistent States
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INVENTORY;
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOPPING);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SHOPPING_LIST;
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PREFERENCES;
  });

  const [impact, setImpact] = useState<ImpactMetrics>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IMPACT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_IMPACT;
  });

  const [cookedHistory, setCookedHistory] = useState<CookedRecipeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECIPES_COOKED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'cook-init-1',
        recipeId: 'rec-1',
        recipeName: 'Creamy Spinach Pasta',
        date: getTodayDateString(-1),
        moneySaved: 8,
        foodSaved: 0.4,
      },
      {
        id: 'cook-init-2',
        recipeId: 'rec-13',
        recipeName: 'Banana Bread',
        date: getTodayDateString(-3),
        moneySaved: 8,
        foodSaved: 0.4,
      },
    ];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['rec-1', 'rec-9', 'rec-18'];
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message?: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check first launch for Onboarding
  useEffect(() => {
    const onboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
    if (!onboarded) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.error(e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(shoppingList));
    } catch (e) {
      console.error(e);
    }
  }, [shoppingList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (e) {
      console.error(e);
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(impact));
    } catch (e) {
      console.error(e);
    }
  }, [impact]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPES_COOKED, JSON.stringify(cookedHistory));
    } catch (e) {
      console.error(e);
    }
  }, [cookedHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Handle Onboarding Completion
  const handleCompleteOnboarding = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
    setIsOnboardingOpen(false);
    addToast('Welcome to FreshPlate! 🌿', 'Your kitchen is initialized with fresh stock and recipes.');
  };

  // INVENTORY ACTIONS
  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
    addToast('Added to Kitchen', `${newItem.emoji} ${newItem.name} saved with expiry tracking.`);
  };

  const handleAddMultipleInventoryItems = (items: Omit<InventoryItem, 'id'>[]) => {
    const newItems: InventoryItem[] = items.map((item, idx) => ({
      ...item,
      id: `inv-scan-${Date.now()}-${idx}`,
    }));
    setInventory((prev) => [...newItems, ...prev]);
    addToast('Scan Completed! 📸', `Added ${newItems.length} fresh ingredients into your kitchen.`);
  };

  const handleUpdateInventoryItem = (updated: InventoryItem) => {
    setInventory((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    addToast('Item Updated', `${updated.emoji} ${updated.name} details modified.`);
  };

  const handleDeleteInventoryItem = (id: string) => {
    const itemToDelete = inventory.find((i) => i.id === id);
    if (!itemToDelete) return;

    // Check if expired: "Each expired item removed: $5 wasted (subtract from savings)"
    const daysLeft = getDaysRemaining(itemToDelete.expiryDate);
    if (daysLeft <= 0) {
      setImpact((prev) => ({
        ...prev,
        moneySaved: Math.max(0, prev.moneySaved - 5),
      }));
      addToast(
        'Item Discarded',
        `${itemToDelete.name} was expired. -$5 estimated waste recorded.`,
        'warning'
      );
    } else {
      addToast('Removed from Kitchen', `${itemToDelete.name} deleted.`);
    }

    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  // RECIPE FAVORITE TOGGLE
  const handleToggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(recipeId);
      if (exists) {
        addToast('Removed from Saved', 'Recipe removed from your favorites list.', 'info');
        return prev.filter((id) => id !== recipeId);
      } else {
        addToast('Saved Recipe ❤️', 'Added to your favorites list.');
        return [...prev, recipeId];
      }
    });
  };

  // FINISH COOKING ACTION (Auto-deduction & impact update)
  const handleFinishCooking = (recipe: Recipe) => {
    // 1. Deduct matched ingredients from inventory
    let updatedInventory = [...inventory];
    let ingredientsRescuedCount = 0;

    recipe.ingredients.forEach((ingredient) => {
      const matchIndex = updatedInventory.findIndex((item) => ingredientMatches(ingredient, item.name));
      if (matchIndex !== -1) {
        ingredientsRescuedCount++;
        const targetItem = updatedInventory[matchIndex];
        const { newQuantity, shouldRemove } = decrementItemQuantity(targetItem.quantity);

        if (shouldRemove) {
          updatedInventory.splice(matchIndex, 1);
        } else {
          updatedInventory[matchIndex] = {
            ...targetItem,
            quantity: newQuantity,
          };
        }
      }
    });

    setInventory(updatedInventory);

    // 2. Add to cooked history
    const record: CookedRecipeRecord = {
      id: `cooked-${Date.now()}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      date: getTodayDateString(0),
      moneySaved: 8,
      foodSaved: 0.4,
    };
    setCookedHistory((prev) => [record, ...prev]);

    // 3. Update impact stats: +$8, +0.4kg, +1.2kg CO2, +45L water
    setImpact((prev) => ({
      ...prev,
      moneySaved: prev.moneySaved + 8,
      foodSaved: Math.round((prev.foodSaved + 0.4) * 10) / 10,
      co2Avoided: Math.round((prev.co2Avoided + 1.2) * 10) / 10,
      waterSaved: prev.waterSaved + 45,
      wasteStreak: prev.wasteStreak + 1,
    }));

    addToast(
      'Meal Complete! 🍳',
      `Cooked ${recipe.name}. Saved $8.00 and rescued ingredients!`
    );
  };

  // SHOPPING LIST ACTIONS
  const handleToggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddShoppingItem = (item: Omit<ShoppingItem, 'id'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: `shop-${Date.now()}`,
    };
    setShoppingList((prev) => [newItem, ...prev]);
    addToast('Added to List', `${newItem.name} added to ${newItem.category}.`);
  };

  const handleClearCompletedShopping = () => {
    const count = shoppingList.filter((i) => i.checked).length;
    setShoppingList((prev) => prev.filter((i) => !i.checked));
    addToast('Cleared Done Items', `Removed ${count} completed items.`);
  };

  const handleDeleteShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  // PREFERENCES ACTIONS
  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  // RESET DEMO DATA
  const handleResetDemoData = () => {
    setInventory(INITIAL_INVENTORY);
    setShoppingList(INITIAL_SHOPPING_LIST);
    setPreferences(INITIAL_PREFERENCES);
    setImpact(INITIAL_IMPACT);
    setFavorites(['rec-1', 'rec-9', 'rec-18']);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(INITIAL_SHOPPING_LIST));
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(INITIAL_PREFERENCES));
    localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(INITIAL_IMPACT));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['rec-1', 'rec-9', 'rec-18']));
    addToast('Demo Data Restored', 'Reset to initial fresh grocery inventory and recipes.');
  };

  // LOGOUT (Reset onboarding to test first launch)
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDED);
    setIsOnboardingOpen(true);
    setCurrentTab('home');
    addToast('Logged Out', 'Onboarding screen re-enabled.');
  };

  // Count expiring items for badge
  const expiringCount = inventory.filter((item) => getDaysRemaining(item.expiryDate) <= 3).length;
  const shoppingPendingCount = shoppingList.filter((item) => !item.checked).length;

  return (
    <div className="min-h-screen bg-[#F0EFEA] flex justify-center selection:bg-[#A8E6CF] selection:text-[#2C3E50]">
      {/* Mobile container baseline (max-w-md, scales to tablet/desktop cleanly) */}
      <div className="w-full max-w-md min-h-screen bg-[#FAFAFA] text-[#2C3E50] relative shadow-2xl flex flex-col">
        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        {/* Screen Content Router */}
        <main className="flex-1 overflow-x-hidden">
          {isImpactDashboardOpen ? (
            <ImpactScreen
              impact={impact}
              onBack={() => setIsImpactDashboardOpen(false)}
              onShowToast={addToast}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeScreen
                  preferences={preferences}
                  inventory={inventory}
                  recipes={RECIPES_DATABASE}
                  impact={impact}
                  onOpenRecipeDetail={(r) => setSelectedRecipeDetail(r)}
                  onNavigateToTab={(tab) => setCurrentTab(tab)}
                  onOpenImpactDashboard={() => setIsImpactDashboardOpen(true)}
                  onOpenScanner={() => setIsScannerOpen(true)}
                  onOpenInstallModal={() => setIsInstallModalOpen(true)}
                />
              )}

              {currentTab === 'inventory' && (
                <InventoryScreen
                  inventory={inventory}
                  onAddItem={handleAddInventoryItem}
                  onUpdateItem={handleUpdateInventoryItem}
                  onDeleteItem={handleDeleteInventoryItem}
                  onOpenScanner={() => setIsScannerOpen(true)}
                />
              )}

              {currentTab === 'recipes' && (
                <RecipesScreen
                  recipes={RECIPES_DATABASE}
                  inventory={inventory}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenRecipeDetail={(r) => setSelectedRecipeDetail(r)}
                />
              )}

              {currentTab === 'shopping' && (
                <ShoppingScreen
                  shoppingList={shoppingList}
                  onToggleItem={handleToggleShoppingItem}
                  onAddItem={handleAddShoppingItem}
                  onClearCompleted={handleClearCompletedShopping}
                  onDeleteItem={handleDeleteShoppingItem}
                  onShowToast={addToast}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileScreen
                  preferences={preferences}
                  impact={impact}
                  recipesCookedCount={cookedHistory.length}
                  totalItemsTracked={inventory.length}
                  onUpdatePreferences={handleUpdatePreferences}
                  onOpenFamilySharing={() => setIsFamilySharingOpen(true)}
                  onOpenImpactDashboard={() => setIsImpactDashboardOpen(true)}
                  onResetDemoData={handleResetDemoData}
                  onLogout={handleLogout}
                  onShowToast={addToast}
                  onOpenInstallModal={() => setIsInstallModalOpen(true)}
                />
              )}
            </>
          )}
        </main>

        {/* Fixed Bottom Navigation (hidden if full-screen overlay active) */}
        {!isImpactDashboardOpen && (
          <BottomNav
            currentTab={currentTab}
            onTabChange={(tab) => {
              setIsImpactDashboardOpen(false);
              setCurrentTab(tab);
            }}
            expiringCount={expiringCount}
            shoppingPendingCount={shoppingPendingCount}
          />
        )}

        {/* SCREEN 1: ONBOARDING MODAL */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleCompleteOnboarding}
        />

        {/* SCREEN 4: SCAN SCREEN */}
        <ScanScreen
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onAddItems={handleAddMultipleInventoryItems}
        />

        {/* SCREEN 6: RECIPE DETAIL + FULL-SCREEN COOKING MODE */}
        <RecipeDetailModal
          recipe={selectedRecipeDetail}
          inventory={inventory}
          onClose={() => setSelectedRecipeDetail(null)}
          onFinishCooking={handleFinishCooking}
        />

        {/* SCREEN 9: FAMILY SHARING MODAL */}
        <FamilySharingModal
          isOpen={isFamilySharingOpen}
          onClose={() => setIsFamilySharingOpen(false)}
          members={FAMILY_MEMBERS}
          activities={MOCK_ACTIVITY_FEED}
          onShowToast={addToast}
        />

        {/* INSTALL / APK MODAL */}
        <InstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          onShowToast={addToast}
        />
      </div>
    </div>
  );
}
