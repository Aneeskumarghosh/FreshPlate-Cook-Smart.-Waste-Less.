import React, { useState } from 'react';
import { ArrowLeft, Share2, Flame, Droplets, Leaf, DollarSign, Award, CheckCircle, TrendingUp } from 'lucide-react';
import { ImpactMetrics } from '../types';

interface ImpactScreenProps {
  impact: ImpactMetrics;
  onBack: () => void;
  onShowToast: (title: string, message?: string) => void;
}

type Period = 'week' | 'month' | 'all';

export const ImpactScreen: React.FC<ImpactScreenProps> = ({ impact, onBack, onShowToast }) => {
  const [period, setPeriod] = useState<Period>('month');

  // Multiplier for demo periods
  const multiplier = period === 'week' ? 0.35 : period === 'month' ? 1.0 : 2.8;

  const currentMoney = Math.round(impact.moneySaved * multiplier);
  const currentFood = Math.round(impact.foodSaved * multiplier * 10) / 10;
  const currentCo2 = Math.round(impact.co2Avoided * multiplier * 10) / 10;
  const currentWater = Math.round(impact.waterSaved * multiplier);

  // Weekly bar data
  const weeklyData = [
    { label: 'W1', value: 85, amount: '$32' },
    { label: 'W2', value: 65, amount: '$24' },
    { label: 'W3', value: 95, amount: '$42' },
    { label: 'W4 (Now)', value: 100, amount: '$50', current: true },
  ];

  const handleShare = async () => {
    const summary = `🌿 I've saved $${currentMoney} and rescued ${currentFood}kg of food using FreshPlate! Zero-waste cooking streak: ${impact.wasteStreak} days 🔥`;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(summary);
        onShowToast('Copied to clipboard!', 'Share your green kitchen milestones with friends.');
      } catch {
        onShowToast('Summary ready!', summary);
      }
    } else {
      onShowToast('Summary ready!', summary);
    }
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-2xl bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#2C3E50] tracking-tight">Impact Dashboard</h1>
            <p className="text-xs text-[#7F8C8D]">Every rescued meal matters</p>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-xs cursor-pointer"
          title="Share Impact"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Time Period Filter Pills */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setPeriod('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Time
        </button>
      </div>

      {/* Hero Mint Card */}
      <div className="bg-[#A8E6CF]/35 border border-[#A8E6CF] rounded-3xl p-5 text-center relative overflow-hidden shadow-xs">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/50 rounded-full blur-2xl pointer-events-none" />
        
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-white/70 px-3 py-1 rounded-full border border-emerald-200">
          Estimated Grocery Savings
        </span>

        <h2 className="text-4xl font-extrabold text-[#1B5E20] mt-3 tracking-tight tabular-nums">
          ${currentMoney}
        </h2>
        <p className="text-xs text-emerald-800/80 mt-1 font-medium">
          {period === 'week' ? 'saved in the last 7 days' : period === 'month' ? 'saved this calendar month' : 'total lifetime savings'}
        </p>
      </div>

      {/* 3 Secondary Stat Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
            <span className="text-sm">🥬</span>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold">Food Rescued</p>
          <p className="text-sm font-extrabold text-slate-800 mt-0.5 tabular-nums">
            {currentFood} kg
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs text-center">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-1.5">
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold">CO₂ Avoided</p>
          <p className="text-sm font-extrabold text-slate-800 mt-0.5 tabular-nums">
            {currentCo2} kg
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs text-center">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1.5">
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold">Water Saved</p>
          <p className="text-sm font-extrabold text-slate-800 mt-0.5 tabular-nums">
            {currentWater} L
          </p>
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-[#FFF8E7] rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-600">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {impact.wasteStreak}-Day No-Waste Streak!
            </h3>
            <p className="text-[11px] text-slate-500">You haven't thrown away an expired item in nearly 2 weeks.</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-amber-700 bg-white/80 px-2 py-1 rounded-lg border border-amber-200">
          Top 5%
        </span>
      </div>

      {/* Last 4 Weeks Bar Chart */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800">Weekly Savings Trend</h3>
          </div>
          <span className="text-[10px] text-slate-400">Past month</span>
        </div>

        {/* Visual CSS Bars */}
        <div className="flex items-end justify-between h-28 pt-4 px-2">
          {weeklyData.map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 w-14">
              <span className="text-[10px] font-bold text-slate-600">{bar.amount}</span>
              <div className="w-8 bg-slate-100 rounded-t-xl h-20 flex items-end overflow-hidden">
                <div
                  className={`w-full transition-all duration-500 rounded-t-xl ${
                    bar.current ? 'bg-[#4CAF50]' : 'bg-emerald-300'
                  }`}
                  style={{ height: `${bar.value}%` }}
                />
              </div>
              <span className={`text-[10px] font-semibold ${bar.current ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* "Equivalent To" Fun Card */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-100 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-lg shrink-0">
          🌍
        </div>
        <div className="text-xs text-teal-900 leading-relaxed">
          <strong className="font-bold">Did you know?</strong> Your avoided food waste of {currentFood}kg equals saving enough electricity to run an LED lightbulb continuously for 48 days!
        </div>
      </div>

      {/* Share CTA */}
      <button
        onClick={handleShare}
        className="w-full py-3.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
      >
        <Share2 className="w-4 h-4" />
        <span>Share Green Milestones</span>
      </button>
    </div>
  );
};
