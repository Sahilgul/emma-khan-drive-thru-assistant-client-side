// Order-related types for the restaurant kiosk app

export interface OrderItem {
  id: string;
  offerCategory: string; // "Combo Meal", "Fries", "Soda", etc.
  title: string; // "Jalapeño Burger"
  type: string; // "burger", "fries", "drink", etc.
  description: string;
  image: string;
  without: string[]; // ["Mayonnaise", "Onion"]
  with: Array<{
    id: string;
    title: string;
    price: number;
    type: 'add' | 'modify';
  }>;
  price: number; // Base price
  size: string; // "Large", "Medium", "Small"
  comment: string; // Special instructions
  quantity: number;
  totalPrice: number; // Calculated total
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface ItemOption {
  id: string;
  name: string;
  options: ItemSize[];
}

export interface ItemSize {
  id: string;
  name: string;
  price: string;
}

export interface VoiceCommand {
  type:
    | 'add_item'
    | 'remove_item'
    | 'modify_item'
    | 'add_customization'
    | 'remove_customization'
    | 'change_quantity'
    | 'proceed_to_payment';
  itemId?: string;
  itemName?: string;
  customization?: string;
  quantity?: number;
  confidence?: number;
}
