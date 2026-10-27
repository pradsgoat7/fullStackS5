export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'collected' | 'cancelled';

export const ACTIVE_STATUSES: OrderStatus[] = ['placed', 'preparing', 'ready'];

// Must match PICKUP_SLOTS in backend/models/Order.js
export const PICKUP_SLOTS = ['ASAP (Next Available)', '12:30 PM - 1:00 PM', '1:00 PM - 1:30 PM', '1:30 PM - 2:00 PM'];

export interface OrderItem {
    food: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    _id: string;
    user: string;
    customerName: string;
    rollNumber: string;
    items: OrderItem[];
    total: number;
    pickupSlot: string;
    token: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}

export interface QueueStats {
    activeOrders: number;
    estimatedWaitMinutes: number;
}

export interface NewOrder {
    items: { food: string; quantity: number }[];
    pickupSlot: string;
    rollNumber: string;
}
