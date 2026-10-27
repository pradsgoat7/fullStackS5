import { useContext } from 'react';
import { OrdersContext } from '../context/ordersContext';
import { ACTIVE_STATUSES } from '../types/order';

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    const activeOrders = (context.orders ?? []).filter((order) => ACTIVE_STATUSES.includes(order.status));
    const pastOrders = (context.orders ?? []).filter((order) => !ACTIVE_STATUSES.includes(order.status));
    return { ...context, activeOrders, pastOrders };
};
