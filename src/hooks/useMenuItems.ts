import { useEffect, useState } from 'react';
import { mockMenuItems, type MenuItem } from '../data/menuItems';

const MOCK_NETWORK_DELAY_MS = 600;

export const useMenuItems = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setError(null);

        const timer = setTimeout(() => {
            if (!isMounted) return;

            if (!mockMenuItems.length) {
                setError('No menu items available right now.');
            } else {
                setItems(mockMenuItems);
            }
            setIsLoading(false);
        }, MOCK_NETWORK_DELAY_MS);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    return { items, isLoading, error };
};
