import React from 'react';
import { Home, Package, ChefHat, ShoppingCart, User } from 'lucide-react';

export type TabType = 'home' | 'inventory' | 'recipes' | 'shopping' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  expiringCount: number;
  shoppingPendingCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  expiringCount,
  shoppingPendingCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home, badge: 0 },
    { id: 'inventory' as TabType, label: 'Inventory', icon: Package, badge: expiringCount },
    { id: 'recipes' as TabType, label: 'Recipes', icon: ChefHat, badge: 0 },
    { id: 'shopping' as TabType, label: 'Shopping', icon: ShoppingCart, badge: shoppingPendingCount },
    { id: 'profile' as TabType, label: 'Profile', icon: User, badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg shadow-slate-900/5">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
                isActive ? 'text-[#4CAF50] font-bold' : 'text-[#7F8C8D] hover:text-[#2C3E50]'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF6B6B] text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-[#4CAF50] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
