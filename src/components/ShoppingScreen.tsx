import React, { useState, useMemo } from 'react';
import { Plus, Check, Trash2, ShoppingBag, ExternalLink, X, Sparkles } from 'lucide-react';
import { ShoppingItem } from '../types';

interface ShoppingScreenProps {
  shoppingList: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<ShoppingItem, 'id'>) => void;
  onClearCompleted: () => void;
  onDeleteItem: (id: string) => void;
  onShowToast: (title: string, message?: string) => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Produce: '🥬',
  Dairy: '🧀',
  Bakery: '🍞',
  Pantry: '🥫',
  Meat: '🥩',
  Snacks: '🍿',
  Other: '🛒',
};

export const ShoppingScreen: React.FC<ShoppingScreenProps> = ({
  shoppingList,
  onToggleItem,
  onAddItem,
  onClearCompleted,
  onDeleteItem,
  onShowToast,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // New item inputs
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Produce');
  const [note, setNote] = useState('');

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    shoppingList.forEach((item) => {
      const cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [shoppingList]);

  const completedCount = shoppingList.filter((i) => i.checked).length;
  const pendingCount = shoppingList.length - completedCount;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      category,
      checked: false,
      note: note.trim() || undefined,
      emoji: CATEGORY_EMOJIS[category] || '🛒',
    });

    setName('');
    setNote('');
    setIsAddModalOpen(false);
  };

  const handleOrderOnline = () => {
    setShowOrderModal(true);
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2C3E50] tracking-tight">Shopping List</h1>
          <p className="text-xs text-[#7F8C8D]">
            {pendingCount} item{pendingCount === 1 ? '' : 's'} remaining to buy
          </p>
        </div>

        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-2.5 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear Done
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 rounded-2xl bg-[#4CAF50] text-white flex items-center justify-center hover:bg-[#43A047] transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
            aria-label="Add shopping item"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Auto-generated meal plan banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-3 flex items-start gap-2.5 shadow-2xs">
        <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="text-xs text-emerald-950 flex-1">
          <span className="font-bold">✨ Smart sync: </span>
          We auto-suggested missing staples for your planned Caprese Salad and Greek Parfait meals.
        </div>
      </div>

      {/* Grouped Shopping Items */}
      {shoppingList.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([catName, items]) => (
            <div key={catName} className="space-y-1.5">
              <div className="flex items-center gap-1.5 px-1">
                <span className="text-sm">{CATEGORY_EMOJIS[catName] || '🛒'}</span>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{catName}</h3>
                <span className="text-[10px] text-slate-400">({items.length})</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 flex items-center justify-between transition-colors ${
                      item.checked ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => onToggleItem(item.id)}
                    >
                      <button
                        type="button"
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                          item.checked
                            ? 'bg-[#4CAF50] border-[#4CAF50] text-white'
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {item.checked && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-bold transition-all truncate ${
                            item.checked ? 'line-through text-slate-400 font-medium' : 'text-slate-800'
                          }`}
                        >
                          {item.name}
                        </p>
                        {item.note && (
                          <p className={`text-[10px] mt-0.5 truncate ${item.checked ? 'text-slate-300' : 'text-slate-400'}`}>
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Order Online Action */}
          <button
            onClick={handleOrderOnline}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Online (Instacart Delivery)</span>
          </button>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
          <span className="text-3xl">🛒</span>
          <h3 className="text-sm font-bold text-slate-800">Your shopping list is clear!</h3>
          <p className="text-xs text-slate-500">
            Add items as you run out or let FreshPlate suggest ingredients for your weekly recipes.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2 px-4 py-2 bg-[#4CAF50] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            + Add First Item
          </button>
        </div>
      )}

      {/* MODAL: ADD SHOPPING ITEM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Add to Shopping List</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Extra virgin olive oil, Oats"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                >
                  <option value="Produce">Produce (Vegetables & Fruits)</option>
                  <option value="Dairy">Dairy & Eggs</option>
                  <option value="Bakery">Bakery & Grains</option>
                  <option value="Pantry">Pantry Staples</option>
                  <option value="Meat">Meat & Seafood</option>
                  <option value="Snacks">Snacks & Treats</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. 2 cartons, organic preferred"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4CAF50] text-white text-xs font-bold hover:bg-[#43A047] shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER ONLINE DIALOG */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
              🥕
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Transfer to Instacart
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              We have pre-filled your grocery cart with {pendingCount} unchecked items from your FreshPlate list for direct delivery to your home!
            </p>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-left max-h-32 overflow-y-auto no-scrollbar text-xs text-slate-700 space-y-1">
              {shoppingList.filter((i) => !i.checked).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span>• {item.name}</span>
                  <span className="text-[10px] text-slate-400">{item.category}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowOrderModal(false);
                onShowToast('Cart Transferred!', 'Simulated: Opening Instacart cart with 1-click checkout.');
              }}
              className="w-full py-3 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue to Checkout</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowOrderModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
