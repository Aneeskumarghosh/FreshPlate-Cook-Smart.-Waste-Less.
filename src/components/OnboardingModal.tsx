import React from 'react';
import { Sparkles, Bell, ChefHat, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-amber-100/60 overflow-hidden text-center flex flex-col items-center">
        {/* Soft background ambient glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Large fridge emoji illustration */}
        <div className="relative my-4 flex items-center justify-center w-28 h-28 bg-emerald-50 rounded-3xl border border-emerald-100 shadow-inner">
          <span className="text-5xl select-none" role="img" aria-label="fridge with fresh food">
            🥬
          </span>
          <div className="absolute -top-2 -right-2 bg-white rounded-2xl p-1.5 shadow-md border border-slate-100 text-lg">
            🍓
          </div>
          <div className="absolute -bottom-2 -left-2 bg-white rounded-2xl p-1.5 shadow-md border border-slate-100 text-lg">
            🥛
          </div>
          <div className="absolute -top-2 -left-2 bg-white rounded-2xl p-1.5 shadow-md border border-slate-100 text-lg">
            🧀
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-1.5 shadow-md border border-slate-100 text-lg">
            🥚
          </div>
        </div>

        {/* Brand Tagline */}
        <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
          FreshPlate Kitchen
        </span>

        <h1 className="text-2xl font-extrabold text-[#2C3E50] mt-3 tracking-tight">
          Cook Smart. Waste Less.
        </h1>

        <p className="text-xs text-[#7F8C8D] mt-2 leading-relaxed px-3">
          Track your fridge, get smart recipe ideas from expiring ingredients, and save over $150 every month.
        </p>

        {/* Feature Highlights */}
        <div className="w-full mt-6 space-y-2.5 text-left">
          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Scan Your Fridge</p>
              <p className="text-[11px] text-slate-500">Log ingredients instantly in 2 seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Expiry Alerts</p>
              <p className="text-[11px] text-slate-500">Know what needs cooking today vs this week</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Recipe Ideas</p>
              <p className="text-[11px] text-slate-500">25+ zero-waste recipes matched to your kitchen</p>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onComplete}
          className="w-full mt-6 py-3.5 px-4 bg-[#4CAF50] hover:bg-[#43A047] active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="mt-3 text-xs text-[#7F8C8D] hover:text-[#2C3E50] transition-colors py-1 cursor-pointer"
        >
          Skip introduction
        </button>
      </div>
    </div>
  );
};
