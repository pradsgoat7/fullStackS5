import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import type { MenuItem } from '../../types/menu';
import { formatPrice } from '../../lib/format';

interface FoodCardProps {
  item: MenuItem;
  /** Omit to show the card without a Pre-Order button (e.g. for canteen staff) */
  onAdd?: (item: MenuItem) => void;
  /** Larger card with the category label, used on the Menu page */
  detailed?: boolean;
}

const LOW_STOCK = 5;

export const FoodCard: React.FC<FoodCardProps> = ({ item, onAdd, detailed = false }) => {
  const isSoldOut = item.stock <= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className={`${detailed ? 'h-40' : 'h-36'} w-full overflow-hidden relative`}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${isSoldOut ? 'grayscale' : ''}`}
            />
          ) : (
            <div className="w-full h-full bg-orange-50 text-orange-300 flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10" />
            </div>
          )}
          {item.tag && (
            <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-orange-600 px-2.5 py-1 rounded-full shadow-sm">
              {item.tag}
            </span>
          )}
          {isSoldOut ? (
            <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 text-white px-2.5 py-1 rounded-full">
              Sold out
            </span>
          ) : item.stock <= LOW_STOCK ? (
            <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase bg-red-500 text-white px-2.5 py-1 rounded-full">
              Only {item.stock} left
            </span>
          ) : null}
        </div>
        <div className="p-4">
          {detailed && <span className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">{item.category}</span>}
          <h4 className={`font-semibold text-slate-900 ${detailed ? 'text-base mt-0.5' : 'text-sm'}`}>{item.name}</h4>
          {item.prepTime !== undefined && (
            <span className="text-xs font-medium text-slate-400">{item.prepTime} mins prep time</span>
          )}
        </div>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <span className={`${detailed ? 'text-lg' : 'text-base'} font-bold text-slate-900`}>{formatPrice(item.price)}</span>
        {onAdd && (
        <button
          onClick={() => onAdd(item)}
          disabled={isSoldOut}
          className={`bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed text-white ${detailed ? 'px-4 py-2' : 'px-3.5 py-1.5'} rounded-xl text-xs font-semibold shadow-sm shadow-orange-500/25 transition-all active:scale-95`}
        >
          {isSoldOut ? 'Sold Out' : 'Pre-Order'}
        </button>
        )}
        {!onAdd && (
          <span className={`text-xs font-semibold ${isSoldOut ? 'text-red-500' : 'text-slate-500'}`}>
            {isSoldOut ? 'Sold out' : `${item.stock} in stock`}
          </span>
        )}
      </div>
    </div>
  );
};
