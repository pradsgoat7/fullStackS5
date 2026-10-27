import { createContext } from 'react';
import type { MenuItem } from '../types/menu';

export interface CartItem {
    /** The menu item's database id */
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CartContextValue {
    cart: CartItem[];
    addToCart: (item: Pick<MenuItem, 'id' | 'name' | 'price'>) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    totalItemsCount: number;
    totalPrice: number;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
