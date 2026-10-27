import { createContext } from 'react';
import type { NewOrder, Order, QueueStats } from '../types/order';

export interface OrdersContextValue {
    /** The logged-in user's orders, newest first; null while loading */
    orders: Order[] | null;
    error: string | null;
    queue: QueueStats | null;
    placeOrder: (order: NewOrder) => Promise<Order>;
    cancelOrder: (id: string) => Promise<Order>;
}

export const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);
