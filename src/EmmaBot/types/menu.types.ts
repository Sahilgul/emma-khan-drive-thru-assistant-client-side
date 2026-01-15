// TypeScript interfaces for Menu Management API

// ===== Menu Items =====
export interface MenuItem {
    id: string;
    category: string;
    name: string;
    price: number;
    ingredients: string;
    makeCombo: boolean;
    comboDetails?: string;
    comboPrice?: number;
    imageUrl: string;
    available: boolean;
    createdAt: string;
}

export interface CreateMenuItemRequest {
    category: string;
    name: string;
    price: number;
    ingredients: string;
    makeCombo: boolean;
    comboDetails?: string;
    comboPrice?: number;
    imageUrl: string;
    available: boolean;
}

// ===== Drinks =====
export interface DrinkOption {
    size: string;
    price: number;
}

export interface Drink {
    id: string;
    name: string;
    iconUrl: string;
    options: DrinkOption[];
    available: boolean;
}

export interface CreateDrinkRequest {
    name: string;
    iconUrl: string;
    options: DrinkOption[];
    available: boolean;
}

// ===== Add-ons =====
export interface Addon {
    id: string;
    name: string;
    icon: string;
    price: number;
    available: boolean;
}

export interface CreateAddonRequest {
    name: string;
    icon: string;
    price: number;
    available: boolean;
}

// ===== Sides =====
export interface SideOption {
    pcs: number;
    price: number;
}

export interface Side {
    id: string;
    name: string;
    iconUrl: string;
    options: SideOption[];
    available: boolean;
}

export interface CreateSideRequest {
    name: string;
    iconUrl: string;
    options: SideOption[];
    available: boolean;
}

// ===== Upload =====
export interface UploadImageResponse {
    url: string;
}
