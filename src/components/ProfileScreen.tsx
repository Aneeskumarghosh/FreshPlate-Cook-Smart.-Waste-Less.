import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Users,
  Sparkles,
  HelpCircle,
  Shield,
  RotateCcw,
  LogOut,
  ChevronRight,
  Flame,
  Clock,
  Heart,
  X,
  Check,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Download
} from 'lucide-react';
import { UserPreferences, ImpactMetrics } from '../types';

interface ProfileScreenProps {
  preferences: UserPreferences;
  impact: ImpactMetrics;
  recipesCookedCount: number;
  totalItemsTracked: number;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onOpenFamilySharing: () => void;
  onOpenImpactDashboard: () => void;
  onResetDemoData: () => void;
  onLogout: () => void;
  onShowToast: (title: string, message?: string) => void;
  onOpenInstallModal: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  preferences,
  impact,
  recipesCookedCount,
  totalItemsTracked,
  onUpdatePreferences,
  onOpenFamilySharing,
  onOpenImpactDashboard,
  onResetDemoData,
  onLogout,
  onShowToast,
  onOpenInstallModal,
}) => {
  // Modal for editing preferences
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(preferences.name);
  const [editHousehold, setEditHousehold] = useState(preferences.householdSize);
  const [editTime, setEditTime] = useState(preferences.cookingTime);
  const [editDiet, setEditDiet] = useState(preferences.dietaryRestrictions.join(', '));

  // Support modal
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences({
      name: editName.trim() || 'Chef',
      householdSize: Number(editHousehold) || 1,
      cookingTime: editTime,
      dietaryRestrictions: editDiet
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setIsEditModalOpen(false);
    onShowToast('Preferences Updated', 'Your kitchen settings have been saved.');
  };

  const handleToggleNotification = (key: 'expiryAlerts' | 'weeklyPlan' | 'monthlyReport') => {
    const updated = {
      ...preferences.notifications,
      [key]: !preferences.notifications[key],
    };
    onUpdatePreferences({ notifications: updated });
    onShowToast(
      'Notification preference updated',
      `${key} is now ${updated[key] ? 'enabled' : 'disabled'}`
    );
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Profile Header */}
      <div className="flex items-center gap-3.5 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
          {preferences.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-slate-800 truncate">{preferences.name}</h1>
          <p className="text-xs text-slate-400 truncate">{preferences.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              Kitchen Captain
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Joined {preferences.joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <p className="text-[10px] text-slate-400 font-semibold">Tracked</p>
          <p className="text-base font-extrabold text-slate-800 mt-0.5 tabular-nums">
            {totalItemsTracked}
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">items</p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <p className="text-[10px] text-slate-400 font-semibold">Cooked</p>
          <p className="text-base font-extrabold text-slate-800 mt-0.5 tabular-nums">
            {recipesCookedCount}
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">recipes</p>
        </div>

        <div
          onClick={onOpenImpactDashboard}
          className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 shadow-xs text-center cursor-pointer hover:bg-emerald-100/60 transition-colors"
        >
          <p className="text-[10px] text-emerald-800 font-semibold">Saved</p>
          <p className="text-base font-extrabold text-emerald-900 mt-0.5 tabular-nums">
            ${impact.moneySaved}
          </p>
          <p className="text-[9px] text-emerald-700 font-bold mt-0.5">View Impact →</p>
        </div>
      </div>

      {/* SECTION 1: Kitchen Preferences */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Kitchen Preferences
            </h2>
          </div>
          <button
            onClick={() => {
              setEditName(preferences.name);
              setEditHousehold(preferences.householdSize);
              setEditTime(preferences.cookingTime);
              setEditDiet(preferences.dietaryRestrictions.join(', '));
              setIsEditModalOpen(true);
            }}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            Edit
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Dietary Style</span>
            <span className="font-bold text-slate-800">
              {preferences.dietaryRestrictions.length > 0
                ? preferences.dietaryRestrictions.join(', ')
                : 'None'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Target Cook Time</span>
            <span className="font-bold text-slate-800">{preferences.cookingTime}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Household Size</span>
            <span className="font-bold text-slate-800">{preferences.householdSize} people</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Notifications */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <Bell className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            In-App Notifications
          </h2>
        </div>

        <div className="space-y-2.5 text-xs">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <p className="font-bold text-slate-800">Expiry Push Alerts</p>
              <p className="text-[10px] text-slate-400">Daily badge when food is ≤ 2 days from expiring</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.expiryAlerts}
              onChange={() => handleToggleNotification('expiryAlerts')}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <p className="font-bold text-slate-800">Weekly Meal Plan Suggestions</p>
              <p className="text-[10px] text-slate-400">Curated recipes based on stock levels</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.weeklyPlan}
              onChange={() => handleToggleNotification('weeklyPlan')}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <p className="font-bold text-slate-800">Monthly Eco Impact Report</p>
              <p className="text-[10px] text-slate-400">Savings breakdown and food rescue stats</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.monthlyReport}
              onChange={() => handleToggleNotification('monthlyReport')}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* SECTION 3: Account & Family Sharing */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-1 divide-y divide-slate-100">
        <button
          onClick={onOpenInstallModal}
          className="w-full flex items-center justify-between py-2 text-xs text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer bg-emerald-50/50"
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-900">Install App / Download APK</p>
              <p className="text-[10px] text-emerald-700">Add to Android home screen or export APK</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
            Get APK
          </span>
        </button>

        <button
          onClick={onOpenFamilySharing}
          className="w-full flex items-center justify-between py-2 text-xs text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-800">Family & Household Sharing</p>
              <p className="text-[10px] text-slate-400">4 active members sync inventory</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveInfoModal('subscription')}
          className="w-full flex items-center justify-between py-2.5 text-xs text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <p className="font-bold text-slate-800">FreshPlate Pro</p>
              <p className="text-[10px] text-slate-400">Lifetime Premium Member</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Active
          </span>
        </button>

        <button
          onClick={() => setActiveInfoModal('apps')}
          className="w-full flex items-center justify-between py-2.5 text-xs text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <div>
              <p className="font-bold text-slate-800">Connected Services</p>
              <p className="text-[10px] text-slate-400">Instacart, Smart Fridge Sync</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* SECTION 4: Help, Privacy, Support */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-1 divide-y divide-slate-100">
        <button
          onClick={() => setActiveInfoModal('help')}
          className="w-full flex items-center justify-between py-2 text-xs text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-slate-700">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="font-medium">Kitchen Help & Waste Guides</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveInfoModal('feedback')}
          className="w-full flex items-center justify-between py-2.5 text-xs text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-slate-700">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="font-medium">Leave Feedback & Rate FreshPlate</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveInfoModal('privacy')}
          className="w-full flex items-center justify-between py-2.5 text-xs text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-slate-700">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="font-medium">Privacy Policy (100% On-Device)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Reset & Logout Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onResetDemoData}
          className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Reset Demo Data to Fresh State</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-3 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Log Out & Reset Onboarding</span>
        </button>
      </div>

      {/* EDIT PREFERENCES MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Edit Preferences</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Dietary Restrictions</label>
                <input
                  type="text"
                  value={editDiet}
                  onChange={(e) => setEditDiet(e.target.value)}
                  placeholder="e.g. Vegetarian, Gluten-Free, Nut Allergy"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Cooking Time</label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                  >
                    <option value="Under 15 min">Under 15 min</option>
                    <option value="Under 30 min">Under 30 min</option>
                    <option value="Under 45 min">Under 45 min</option>
                    <option value="Any time">Any time</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Household Size</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editHousehold}
                    onChange={(e) => setEditHousehold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4CAF50] text-white text-xs font-bold hover:bg-[#43A047] shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INFO DIALOG (Support, Privacy, Pro, etc.) */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 capitalize">
                {activeInfoModal === 'subscription' && 'FreshPlate Pro Membership'}
                {activeInfoModal === 'apps' && 'Connected Smart Appliances'}
                {activeInfoModal === 'help' && 'Kitchen Waste Prevention Guide'}
                {activeInfoModal === 'feedback' && 'Feedback & Rating'}
                {activeInfoModal === 'privacy' && '100% Private On-Device Storage'}
              </h3>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              {activeInfoModal === 'subscription' && (
                <p>
                  You are enrolled in the complete FreshPlate Pro tier. Enjoy unlimited AI fridge scans, intelligent recipe recommendations, and zero-waste impact analytics.
                </p>
              )}
              {activeInfoModal === 'apps' && (
                <p>
                  Integrated with Instacart for one-click grocery refills and smart barcode scanner modules. Syncs in real time with household members.
                </p>
              )}
              {activeInfoModal === 'help' && (
                <ul className="list-disc pl-4 space-y-1">
                  <li>Store herbs in a small glass of water in the fridge door.</li>
                  <li>Keep bananas separated from apples to slow ripening.</li>
                  <li>Freeze leftover spinach and berries for morning smoothies.</li>
                </ul>
              )}
              {activeInfoModal === 'feedback' && (
                <p>
                  Thank you for using FreshPlate to keep food out of landfills! Send ideas or report improvements anytime to hello@freshplate.app.
                </p>
              )}
              {activeInfoModal === 'privacy' && (
                <p>
                  All your grocery dates, dietary preferences, and cooking stats are preserved privately in your browser's localStorage. Zero tracking or third-party ads.
                </p>
              )}
            </div>

            <button
              onClick={() => setActiveInfoModal(null)}
              className="w-full mt-2 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
