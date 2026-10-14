import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Clock,
  Users,
  Check,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { Recipe, InventoryItem } from '../types';
import { ingredientMatches, getDaysRemaining } from '../utils/helpers';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  inventory: InventoryItem[];
  onClose: () => void;
  onFinishCooking: (recipe: Recipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  inventory,
  onClose,
  onFinishCooking,
}) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Cooking Timer state
  const [timerSeconds, setTimerSeconds] = useState(180); // default 3 min per step
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Voice narration state
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Celebrate modal state
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCookingMode && isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCookingMode, isTimerRunning]);

  // Voice narration with SpeechSynthesis
  useEffect(() => {
    if (isCookingMode && isVoiceActive && recipe && recipe.steps[currentStepIndex]) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = `Step ${currentStepIndex + 1}. ${recipe.steps[currentStepIndex]}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isCookingMode, isVoiceActive, currentStepIndex, recipe]);

  if (!recipe) return null;

  // Determine which ingredients are currently in the user's inventory
  const ingredientsCheck = recipe.ingredients.map((ingredient) => {
    const matched = inventory.find((item) => ingredientMatches(ingredient, item.name));
    const isExpiring = matched ? getDaysRemaining(matched.expiryDate) <= 3 : false;
    return {
      name: ingredient,
      hasInInventory: !!matched,
      matchedItem: matched,
      isExpiring,
    };
  });

  const expiringCount = ingredientsCheck.filter((i) => i.isExpiring).length;

  const handleStartCooking = () => {
    setIsCookingMode(true);
    setCurrentStepIndex(0);
    setTimerSeconds(180);
    setIsTimerRunning(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setTimerSeconds(180);
      setIsTimerRunning(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setTimerSeconds(180);
      setIsTimerRunning(false);
    }
  };

  const handleFinishCookingClick = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setShowCelebration(true);
  };

  const handleConfirmCompletion = () => {
    setShowCelebration(false);
    setIsCookingMode(false);
    onFinishCooking(recipe);
    onClose();
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // COOKING MODE FULL-SCREEN OVERLAY
  if (isCookingMode) {
    const totalSteps = recipe.steps.length;
    const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;
    const currentStepText = recipe.steps[currentStepIndex];

    return (
      <div className="fixed inset-0 z-50 bg-[#1A1A1A] text-white flex flex-col justify-between p-6 animate-in fade-in select-none">
        {/* Top bar */}
        <div>
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{recipe.emoji}</span>
              <div>
                <h2 className="text-xs font-bold text-slate-300 truncate max-w-[200px]">
                  {recipe.name}
                </h2>
                <p className="text-[10px] text-emerald-400 font-medium">Hands-free Kitchen Mode</p>
              </div>
            </div>

            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsCookingMode(false);
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              aria-label="Exit cooking mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#4CAF50] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2 text-xs text-slate-400 font-semibold">
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
            <span>{Math.round(progressPercent)}% completed</span>
          </div>
        </div>

        {/* Center: Step Instruction Text & Timer */}
        <div className="my-auto py-6 space-y-6 max-w-md mx-auto w-full">
          {/* Large Step Text */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
            <span className="inline-block text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full mb-3">
              Action {currentStepIndex + 1}
            </span>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-100">
              {currentStepText}
            </p>
          </div>

          {/* Interactive Step Timer */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Step Timer</p>
                <p className="text-xl font-bold font-mono tracking-wider text-white">
                  {formatTimer(timerSeconds)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-[#4CAF50] hover:bg-emerald-600 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(180);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="max-w-md mx-auto w-full space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="py-3.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Voice assistant toggle */}
            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`py-3.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                isVoiceActive
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-white/10 border-transparent text-slate-300 hover:bg-white/20'
              }`}
            >
              {isVoiceActive ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span>{isVoiceActive ? 'Voice ON' : 'Voice'}</span>
            </button>

            {currentStepIndex < totalSteps - 1 ? (
              <button
                onClick={handleNextStep}
                className="py-3.5 px-3 rounded-2xl bg-[#4CAF50] hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishCookingClick}
                className="py-3.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/40 cursor-pointer animate-pulse-subtle"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>Finish!</span>
              </button>
            )}
          </div>
        </div>

        {/* CELEBRATION MODAL */}
        {showCelebration && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#FFFDF9] text-[#2C3E50] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-amber-200 space-y-4">
              <div className="text-5xl select-none animate-bounce">
                🎉
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Kitchen Hero!
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Meal Successfully Cooked!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  You cooked <strong>{recipe.name}</strong> and prevented delicious groceries from ending up in the landfill.
                </p>
              </div>

              {/* Impact stats gained */}
              <div className="grid grid-cols-2 gap-2 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 text-left">
                <div className="p-1.5">
                  <p className="text-[10px] text-slate-500 font-medium">💰 Saved</p>
                  <p className="text-base font-extrabold text-emerald-800">+$8.00</p>
                </div>
                <div className="p-1.5">
                  <p className="text-[10px] text-slate-500 font-medium">🥬 Food Saved</p>
                  <p className="text-base font-extrabold text-emerald-800">+0.4 kg</p>
                </div>
                <div className="p-1.5">
                  <p className="text-[10px] text-slate-500 font-medium">🌱 CO₂ Avoided</p>
                  <p className="text-base font-extrabold text-emerald-800">+1.2 kg</p>
                </div>
                <div className="p-1.5">
                  <p className="text-[10px] text-slate-500 font-medium">💧 Water Saved</p>
                  <p className="text-base font-extrabold text-emerald-800">+45 L</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Matched ingredients have been automatically deducted from your kitchen storage.
              </p>

              <button
                onClick={handleConfirmCompletion}
                className="w-full py-3.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/25 cursor-pointer"
              >
                Back to FreshPlate
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STANDARD RECIPE DETAIL VIEW (BOTTOM SHEET / MODAL)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-b from-amber-50 to-white p-5 pb-3 border-b border-amber-100/60 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Large Hero Emoji */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-amber-200/80 shadow-md flex items-center justify-center text-5xl mb-2 select-none">
            {recipe.image || recipe.emoji}
          </div>

          <h2 className="text-base font-bold text-slate-800">{recipe.name}</h2>
          <p className="text-[11px] text-slate-500">{recipe.cuisine} Cuisine · {recipe.tags.join(', ')}</p>

          {/* Quick Metrics */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {recipe.time}
            </span>
            <span>·</span>
            <span>{recipe.difficulty}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {recipe.servings} Servings
            </span>
          </div>

          {/* Expiring Badge */}
          {expiringCount > 0 && (
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B5E20] bg-[#A8E6CF]/50 border border-[#A8E6CF] px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                Rescues {expiringCount} expiring ingredient{expiringCount > 1 ? 's' : ''}!
              </span>
            </div>
          )}
        </div>

        {/* Tab switchers: Ingredients vs Steps */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'ingredients'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Ingredients ({recipe.ingredients.length})
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Steps ({recipe.steps.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-2.5">
          {activeTab === 'ingredients' ? (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 font-medium">
                Items with green checkmarks are already in your kitchen inventory:
              </p>
              {ingredientsCheck.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    item.hasInInventory
                      ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        item.hasInInventory
                          ? 'bg-[#4CAF50] text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {item.hasInInventory ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                    </div>
                    <span className="capitalize font-semibold">{item.name}</span>
                  </div>

                  {item.isExpiring && (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300">
                      Expiring Soon!
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA to start Cooking Mode */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleStartCooking}
            className="w-full py-3.5 bg-[#4CAF50] hover:bg-[#43A047] active:scale-[0.98] text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>Start Cooking Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
