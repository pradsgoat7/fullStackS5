import React, { useCallback, useEffect, useState } from 'react';
import { OrdersContext } from './ordersContext';
import { ApiError, apiRequest } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import type { NewOrder, Order, QueueStats } from '../types/order';

// Replace an order in the list (or add it at the top if it's new)
const upsert = (orders: Order[], order: Order) =>
    orders.some((o) => o._id === order._id)
        ? orders.map((o) => (o._id === order._id ? order : o))
        : [order, ...orders];

// The logged-in user's orders and the canteen queue, kept live over Socket.IO
export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, user, logout } = useAuth();
    const userId = user?._id;
    const { socket } = useSocket();
    // Keyed by token so a previous user's orders are never shown to the next one
    const [state, setState] = useState<{ token: string | null; orders: Order[] | null; error: string | null }>({
        token: null, orders: null, error: null,
    });
    const [queue, setQueue] = useState<QueueStats | null>(null);

    const handleError = useCallback((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) logout(err.message);
        return err instanceof Error ? err.message : 'Something went wrong';
    }, [logout]);

    const load = useCallback(() => {
        if (!token) return;
        apiRequest<Order[]>('/api/orders/mine', { token })
            .then((orders) => setState({ token, orders, error: null }))
            .catch((err: unknown) => setState({ token, orders: null, error: handleError(err) }));
        apiRequest<QueueStats>('/api/orders/queue', { token })
            .then(setQueue)
            .catch(handleError);
    }, [token, handleError]);

    useEffect(() => {
        load();
    }, [load]);

    // Live updates: my orders change status, the queue grows or shrinks; resync after a reconnect
    useEffect(() => {
        if (!socket) return;
        // Only ever add the logged-in user's own orders to this list
        const onOrder = (order: Order) => {
            if (order.user !== userId) return;
            setState((prev) => (prev.orders ? { ...prev, orders: upsert(prev.orders, order) } : prev));
        };
        socket.on('order:updated', onOrder);
        socket.on('queue:update', setQueue);
        socket.io.on('reconnect', load);
        return () => {
            socket.off('order:updated', onOrder);
            socket.off('queue:update', setQueue);
            socket.io.off('reconnect', load);
        };
    }, [socket, load, userId]);

    const placeOrder = async (newOrder: NewOrder) => {
        const order = await apiRequest<Order>('/api/orders', { method: 'POST', body: newOrder, token });
        setState((prev) => ({ ...prev, orders: upsert(prev.orders ?? [], order) }));
        return order;
    };

    const cancelOrder = async (id: string) => {
        const order = await apiRequest<Order>(`/api/orders/${id}/cancel`, { method: 'PATCH', token });
        setState((prev) => ({ ...prev, orders: upsert(prev.orders ?? [], order) }));
        return order;
    };

    const isCurrent = token !== null && state.token === token;

    return (
        <OrdersContext.Provider
            value={{
                orders: isCurrent ? state.orders : null,
                error: isCurrent ? state.error : null,
                queue: token ? queue : null,
                placeOrder,
                cancelOrder,
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
};
