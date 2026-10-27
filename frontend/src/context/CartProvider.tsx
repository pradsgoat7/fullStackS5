import React, { useState } from 'react';
import { CartContext, type CartContextValue, type CartItem } from './cartContext';

// The server allows up to 10 of one item per order
const MAX_QUANTITY = 10;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart: CartContextValue['addToCart'] = (item) => {
        setCart((prevCart) => {
            const existing = prevCart.find((i) => i.id === item.id);
            if (existing) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + 1) } : i
                );
            }
            return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItemsCount, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};
