import React, { useState } from 'react';
import { Search, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useMenuItems } from '../hooks/useMenuItems';
import { FoodCard } from '../components/menu/FoodCard';
import { useAuth } from '../hooks/useAuth';

export const MenuPage: React.FC = () => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    // Only students order; staff see the menu with stock levels instead
    const canOrder = user?.role === 'student';
    const { items: menuItems, isLoading, error } = useMenuItems();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Quick Bites', 'South Indian', 'Meals & Thalis', 'Chinese', 'Healthy', 'Beverages', 'Desserts'];

    const filteredItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header Banner */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <UtensilsCrossed className="w-6 h-6 text-orange-500" />
                        Canteen Menu Catalog
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Browse items by category, check prep times, and pre-order instantly.</p>
                </div>
                <div className="bg-orange-50 text-orange-600 border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Live stock from the canteen
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 w-full md:w-96">
                    <Search className="w-5 h-5 text-slate-400 ml-1" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search any food item..."
                        className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            {error ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                    <p className="text-red-500 text-sm font-medium">{error}</p>
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                            <div className="h-40 w-full bg-slate-100" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 w-1/3 bg-slate-100 rounded" />
                                <div className="h-4 w-2/3 bg-slate-100 rounded" />
                                <div className="h-3 w-1/4 bg-slate-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => <FoodCard key={item.id} item={item} onAdd={canOrder ? addToCart : undefined} detailed />)
                ) : (
                    <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-500 text-sm font-medium">No menu items found matching your filter.</p>
                    </div>
                )}
            </div>
            )}
        </div>
    );
};