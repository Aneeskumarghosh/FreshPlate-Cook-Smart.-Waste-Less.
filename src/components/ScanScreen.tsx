import React, { useState, useEffect } from 'react';
import { Camera, Check, RefreshCw, X, Sparkles, PlusCircle } from 'lucide-react';
import { InventoryItem } from '../types';
import { getTodayDateString } from '../utils/helpers';

interface ScanScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (items: Omit<InventoryItem, 'id'>[]) => void;
}

interface DetectedItem {
  id: string;
  name: string;
  emoji: string;
  category: 'Fridge' | 'Freezer' | 'Pantry';
  quantity: string;
  expiryDays: number;
  selected: boolean;
}

const DEFAULT_DETECTED: DetectedItem[] = [
  { id: 'det-1', name: 'Fresh Baby Spinach', emoji: '🥬', category: 'Fridge', quantity: '1 bag', expiryDays: 4, selected: true },
  { id: 'det-2', name: 'Whole Milk', emoji: '🥛', category: 'Fridge', quantity: '1 carton', expiryDays: 5, selected: true },
  { id: 'det-3', name: 'Free-Range Eggs', emoji: '🥚', category: 'Fridge', quantity: '1 dozen', expiryDays: 14, selected: true },
  { id: 'det-4', name: 'Sharp Cheddar Cheese', emoji: '🧀', category: 'Fridge', quantity: '250g', expiryDays: 10, selected: true },
  { id: 'det-5', name: 'Organic Strawberries', emoji: '🍓', category: 'Fridge', quantity: '1 punnet', expiryDays: 3, selected: true },
];

export const ScanScreen: React.FC<ScanScreenProps> = ({ isOpen, onClose, onAddItems }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>(DEFAULT_DETECTED);

  // Run 2-second scanning animation
  useEffect(() => {
    if (!isOpen) return;
    setIsScanning(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScanAgain = () => {
    setIsScanning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleToggleItem = (id: string) => {
    setDetectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleNameChange = (id: string, newName: string) => {
    setDetectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const handleAddSelected = () => {
    const selected = detectedItems.filter((i) => i.selected);
    if (selected.length === 0) return;

    const itemsToSave: Omit<InventoryItem, 'id'>[] = selected.map((item) => ({
      name: item.name,
      emoji: item.emoji,
      category: item.category,
      quantity: item.quantity,
      addedDate: getTodayDateString(0),
      expiryDate: getTodayDateString(item.expiryDays),
    }));

    onAddItems(itemsToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">AI Kitchen Vision</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-slate-950 p-6 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-4 border border-dashed border-emerald-500/30 rounded-2xl pointer-events-none" />

          {/* Laser scanning line */}
          {isScanning && (
            <div
              className="absolute left-6 right-6 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] transition-all duration-200"
              style={{ top: `${20 + (progress % 60)}%` }}
            />
          )}

          {/* Center visual */}
          <div className="text-center z-10 space-y-2">
            <div className="text-5xl select-none animate-pulse-subtle">
              {isScanning ? '📸' : '✨'}
            </div>
            <p className="text-xs font-bold text-white tracking-wide">
              {isScanning ? 'Analyzing groceries & receipts...' : '5 items detected with 99% confidence!'}
            </p>
            <p className="text-[11px] text-slate-400">
              {isScanning ? `Simulating visual recognition (${progress}%)` : 'Verify or rename items below'}
            </p>
          </div>

          {/* Progress bar */}
          {isScanning && (
            <div className="w-48 bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Detected Ingredients</span>
            <button
              onClick={handleScanAgain}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Scan Again</span>
            </button>
          </div>

          {/* Detected Items List */}
          <div className="space-y-2">
            {detectedItems.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  item.selected
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleItem(item.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                    item.selected
                      ? 'bg-[#4CAF50] border-[#4CAF50] text-white shadow-xs'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {item.selected && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <span className="text-2xl">{item.emoji}</span>

                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">
                    {item.quantity} · Est. {item.expiryDays}d freshness
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSelected}
            disabled={isScanning || detectedItems.filter((i) => i.selected).length === 0}
            className="flex-2 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              Add All to Fridge ({detectedItems.filter((i) => i.selected).length})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
