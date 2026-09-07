import { useState } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: { name: string; price: string }) => {
        const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10);

        setCart((prevCart) => {
            const existing = prevCart.find((i) => i.name === item.name);
            if (existing) {
                return prevCart.map((i) =>
                    i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { id: Date.now().toString(), name: item.name, price: numericPrice, quantity: 1 }];
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

    return { cart, addToCart, removeFromCart, clearCart, totalItemsCount, totalPrice };
};