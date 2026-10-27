import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import type { MenuItem } from '../types/menu';

interface FoodResponse {
    _id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    prepTime?: number;
    tag?: string;
    image?: string;
    available?: boolean;
}

// Loads the live menu (prices and stock) from the public /api/foods endpoint
export const useMenuItems = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        apiRequest<FoodResponse[]>('/api/foods')
            .then((foods) => {
                if (!isMounted) return;
                const menu = foods
                    .filter((food) => food.available !== false)
                    .map(({ _id, name, category, price, stock, prepTime, tag, image }) => ({
                        id: _id, name, category, price, stock, prepTime, tag, image,
                    }));
                if (menu.length === 0) {
                    setError('No menu items available right now.');
                } else {
                    setItems(menu);
                }
            })
            .catch((err: unknown) => {
                if (isMounted) setError(err instanceof Error ? err.message : 'Could not load the menu');
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading, error };
};
