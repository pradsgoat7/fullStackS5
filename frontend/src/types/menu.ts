export interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    prepTime?: number;
    tag?: string;
    image?: string;
}
