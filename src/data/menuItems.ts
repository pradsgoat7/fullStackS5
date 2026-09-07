export interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: string;
    time: string;
    tag: string;
    image: string;
}

export const mockMenuItems: MenuItem[] = [
    {
        id: 'peri-peri-fries',
        name: 'Peri Peri Masala Fries',
        category: 'Quick Bites',
        price: '₹70',
        time: '5 mins',
        tag: 'Bestseller',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=300&fit=crop',
    },
    {
        id: 'cold-coffee',
        name: 'Cold Coffee with Ice Cream',
        category: 'Beverages',
        price: '₹90',
        time: '3 mins',
        tag: 'Refreshing',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&h=300&fit=crop',
    },
    {
        id: 'paneer-cheese-burger',
        name: 'Paneer Cheese Burger',
        category: 'Quick Bites',
        price: '₹120',
        time: '8 mins',
        tag: 'Chef Choice',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
    },
    {
        id: 'masala-dosa',
        name: 'Masala Dosa',
        category: 'South Indian',
        price: '₹80',
        time: '7 mins',
        tag: 'Popular',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=300&fit=crop',
    },
    {
        id: 'south-indian-thali',
        name: 'Special South Indian Thali',
        category: 'Meals & Thalis',
        price: '₹150',
        time: '12 mins',
        tag: 'Today Special',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop',
    },
    {
        id: 'fresh-lime-soda',
        name: 'Fresh Lime Soda',
        category: 'Beverages',
        price: '₹40',
        time: '2 mins',
        tag: 'Cooler',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=300&fit=crop',
    },
];
