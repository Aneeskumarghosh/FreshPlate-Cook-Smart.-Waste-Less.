import React, { useState, useMemo } from 'react';
import { Search, Plus, Camera, Trash2, Edit3, X, Check, Filter } from 'lucide-react';
import { InventoryItem, InventoryCategory, ExpiryStatus } from '../types';
import { getDaysRemaining, formatExpiryLabel, getTodayDateString } from '../utils/helpers';

interface InventoryScreenProps {
  inventory: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenScanner: () => void;
}

const POPULAR_EMOJIS = ['🥬', '🥛', '🧀', '🥚', '🍓', '🍌', '🍅', '🍗', '🥦', '🥑', '🍞', '🍝', '🧄', '🍚', '🥣', '🫛', '🧈', '🫓', '🍎', '🥕', '🥔', '🧅', '🥩', '🐟'];

const CATEGORIES: ('All' | InventoryCategory)[] = ['All', 'Fridge', 'Freezer', 'Pantry', 'Spices'];

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  inventory,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onOpenScanner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | InventoryCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | ExpiryStatus>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemEmoji, setNewItemEmoji] = useState('🥬');
  const [newItemCategory, setNewItemCategory] = useState<InventoryCategory>('Fridge');
  const [newItemQuantity, setNewItemQuantity] = useState('1 unit');
  const [newItemExpiry, setNewItemExpiry] = useState(getTodayDateString(5));

  // Counts for status filters
  const statusCounts = useMemo(() => {
    let today = 0;
    let soon = 0;
    let fresh = 0;
    inventory.forEach(item => {
      const days = getDaysRemaining(item.expiryDate);
      if (days <= 0) today++;
      else if (days <= 3) soon++;
      else fresh++;
    });
    return { today, soon, fresh };
  }, [inventory]);

  // Filtered and sorted inventory (soonest expiry first)
  const filteredItems = useMemo(() => {
    return inventory
      .filter(item => {
        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }
        // Status filter
        if (statusFilter !== 'all') {
          const days = getDaysRemaining(item.expiryDate);
          if (statusFilter === 'today' && days > 0) return false;
          if (statusFilter === 'soon' && (days <= 0 || days > 3)) return false;
          if (statusFilter === 'fresh' && days <= 3) return false;
        }
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate));
  }, [inventory, selectedCategory, statusFilter, searchQuery]);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      emoji: newItemEmoji,
      category: newItemCategory,
      quantity: newItemQuantity.trim() || '1 item',
      addedDate: getTodayDateString(0),
      expiryDate: newItemExpiry || getTodayDateString(3),
    });

    // Reset and close
    setNewItemName('');
    setNewItemQuantity('1 unit');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name.trim()) return;
    onUpdateItem(editingItem);
    setEditingItem(null);
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2C3E50] tracking-tight">My Kitchen</h1>
          <p className="text-xs text-[#7F8C8D]">
            {inventory.length} total items in your storage
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Scan camera trigger */}
          <button
            onClick={onOpenScanner}
            className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer"
            aria-label="Scan groceries"
            title="Scan Fridge"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Quick Add button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 rounded-2xl bg-[#4CAF50] text-white flex items-center justify-center hover:bg-[#43A047] transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
            aria-label="Add ingredient"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Live Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ingredients, categories..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#2C3E50] text-white shadow-sm'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Status Filter Buttons */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setStatusFilter(statusFilter === 'today' ? 'all' : 'today')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            statusFilter === 'today'
              ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
          <span>Today ({statusCounts.today})</span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'soon' ? 'all' : 'soon')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            statusFilter === 'soon'
              ? 'bg-[#FFB74D] text-slate-900 border-[#FFB74D] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#FFB74D]" />
          <span>Soon ({statusCounts.soon})</span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'fresh' ? 'all' : 'fresh')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            statusFilter === 'fresh'
              ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
          <span>Fresh ({statusCounts.fresh})</span>
        </button>
      </div>

      {/* Item List */}
      <div className="space-y-2.5">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const expiry = formatExpiryLabel(item.expiryDate);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-slate-300 transition-all group"
              >
                {/* Left emoji & info */}
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setEditingItem(item)}
                >
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-slate-800 truncate">{item.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      <span>{item.quantity}</span>
                      <span className="mx-1">·</span>
                      <span className="text-slate-500 font-medium">{item.category}</span>
                    </p>
                  </div>
                </div>

                {/* Right badge & actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${expiry.badgeClass}`}>
                    {expiry.text}
                  </span>

                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                    aria-label="Edit item"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
            <span className="text-4xl">📦</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Your kitchen is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No items match your filters. Add an item or scan your fridge to stock up!
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              + Add Item
            </button>
          </div>
        )}
      </div>

      {/* MODAL: ADD ITEM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Add to Kitchen</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3.5">
              {/* Emoji selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">Choose Icon</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {POPULAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewItemEmoji(emoji)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border transition-all cursor-pointer ${
                        newItemEmoji === emoji
                          ? 'border-[#4CAF50] bg-emerald-50 scale-105'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Greek Yogurt, Carrots"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
                />
              </div>

              {/* Category & Quantity in 2 cols */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as InventoryCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                  >
                    <option value="Fridge">Fridge</option>
                    <option value="Freezer">Freezer</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Quantity</label>
                  <input
                    type="text"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder="e.g. 500g, 2 pcs"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Estimated Expiry</label>
                <input
                  type="date"
                  required
                  value={newItemExpiry}
                  onChange={(e) => setNewItemExpiry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                />
              </div>

              {/* Actions */}
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ITEM */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Edit {editingItem.name}</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as InventoryCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                  >
                    <option value="Fridge">Fridge</option>
                    <option value="Freezer">Freezer</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Quantity</label>
                  <input
                    type="text"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={editingItem.expiryDate}
                  onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteItem(editingItem.id);
                    setEditingItem(null);
                  }}
                  className="px-3 py-2.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4CAF50] text-white text-xs font-bold hover:bg-[#43A047] shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
