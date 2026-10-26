import { createContext } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CartContextValue {
    cart: CartItem[];
    addToCart: (item: { name: string; price: string }) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    totalItemsCount: number;
    totalPrice: number;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
