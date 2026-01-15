import { createApiClient } from '@emma/lib/api';
import type {
    MenuItem,
    CreateMenuItemRequest,
    Drink,
    CreateDrinkRequest,
    Addon,
    CreateAddonRequest,
    Side,
    CreateSideRequest,
    UploadImageResponse,
} from '@emma/types/menu.types';

// Create API client instance
const apiClient = createApiClient(import.meta.env.VITE_SERVER_URL);

// ===== Image Upload =====

/**
 * Upload an image file to Google Cloud Storage
 * @param file - The image file to upload
 * @param folder - Target folder in bucket (default: "misc")
 * @returns Promise with the uploaded image URL
 */
export async function uploadImage(
    file: File,
    folder: string = 'menu'
): Promise<UploadImageResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const data = await apiClient.upload<UploadImageResponse>(
            '/api/v1/upload',
            formData
        );

        console.log('✅ Image uploaded successfully:', data.url);
        return data;
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        throw error;
    }
}

// ===== Menu Items =====

/**
 * Create a new menu item
 * @param restaurantId - The restaurant ID
 * @param data - Menu item data
 * @returns Promise with the created menu item
 */
export async function createMenuItem(
    restaurantId: string,
    data: CreateMenuItemRequest
): Promise<MenuItem> {
    try {
        const response = await apiClient.post<MenuItem>(
            `/api/v1/restaurants/${restaurantId}/menu`,
            data
        );
        console.log('✅ Menu item created:', response);
        return response;
    } catch (error) {
        console.error('❌ Error creating menu item:', error);
        throw error;
    }
}

/**
 * Get all menu items for a restaurant
 * @param restaurantId - The restaurant ID
 * @param category - Optional category filter
 * @returns Promise with array of menu items
 */
export async function getMenuItems(
    restaurantId: string,
    category?: string
): Promise<MenuItem[]> {
    try {
        const endpoint = category
            ? `/api/v1/restaurants/${restaurantId}/menu?category=${encodeURIComponent(category)}`
            : `/api/v1/restaurants/${restaurantId}/menu`;

        const response = await apiClient.get<MenuItem[]>(endpoint);
        console.log(`✅ Fetched ${response.length} menu items`);
        return response;
    } catch (error) {
        console.error('❌ Error fetching menu items:', error);
        throw error;
    }
}

/**
 * Update a menu item
 * @param restaurantId - The restaurant ID
 * @param itemId - The menu item ID
 * @param data - Partial menu item data to update
 * @returns Promise with the updated menu item
 */
export async function updateMenuItem(
    restaurantId: string,
    itemId: string,
    data: Partial<CreateMenuItemRequest>
): Promise<MenuItem> {
    try {
        const response = await apiClient.put<MenuItem>(
            `/api/v1/restaurants/${restaurantId}/menu/${itemId}`,
            data
        );
        console.log('✅ Menu item updated:', response);
        return response;
    } catch (error) {
        console.error('❌ Error updating menu item:', error);
        throw error;
    }
}

/**
 * Delete a menu item
 * @param restaurantId - The restaurant ID
 * @param itemId - The menu item ID
 * @returns Promise with success message
 */
export async function deleteMenuItem(
    restaurantId: string,
    itemId: string
): Promise<{ message: string }> {
    try {
        const response = await apiClient.delete<{ message: string }>(
            `/api/v1/restaurants/${restaurantId}/menu/${itemId}`
        );
        console.log('✅ Menu item deleted');
        return response;
    } catch (error) {
        console.error('❌ Error deleting menu item:', error);
        throw error;
    }
}

// ===== Drinks =====

/**
 * Create a new drink
 * @param restaurantId - The restaurant ID
 * @param data - Drink data
 * @returns Promise with the created drink
 */
export async function createDrink(
    restaurantId: string,
    data: CreateDrinkRequest
): Promise<Drink> {
    try {
        const response = await apiClient.post<Drink>(
            `/api/v1/restaurants/${restaurantId}/drinks`,
            data
        );
        console.log('✅ Drink created:', response);
        return response;
    } catch (error) {
        console.error('❌ Error creating drink:', error);
        throw error;
    }
}

/**
 * Get all drinks for a restaurant
 * @param restaurantId - The restaurant ID
 * @returns Promise with array of drinks
 */
export async function getDrinks(restaurantId: string): Promise<Drink[]> {
    try {
        const response = await apiClient.get<Drink[]>(
            `/api/v1/restaurants/${restaurantId}/drinks`
        );
        console.log(`✅ Fetched ${response.length} drinks`);
        return response;
    } catch (error) {
        console.error('❌ Error fetching drinks:', error);
        throw error;
    }
}

/**
 * Update a drink
 * @param restaurantId - The restaurant ID
 * @param drinkId - The drink ID
 * @param data - Partial drink data to update
 * @returns Promise with the updated drink
 */
export async function updateDrink(
    restaurantId: string,
    drinkId: string,
    data: Partial<CreateDrinkRequest>
): Promise<Drink> {
    try {
        const response = await apiClient.put<Drink>(
            `/api/v1/restaurants/${restaurantId}/drinks/${drinkId}`,
            data
        );
        console.log('✅ Drink updated:', response);
        return response;
    } catch (error) {
        console.error('❌ Error updating drink:', error);
        throw error;
    }
}

/**
 * Delete a drink
 * @param restaurantId - The restaurant ID
 * @param drinkId - The drink ID
 * @returns Promise with success message
 */
export async function deleteDrink(
    restaurantId: string,
    drinkId: string
): Promise<{ message: string }> {
    try {
        const response = await apiClient.delete<{ message: string }>(
            `/api/v1/restaurants/${restaurantId}/drinks/${drinkId}`
        );
        console.log('✅ Drink deleted');
        return response;
    } catch (error) {
        console.error('❌ Error deleting drink:', error);
        throw error;
    }
}

// ===== Add-ons =====

/**
 * Create a new add-on
 * @param restaurantId - The restaurant ID
 * @param data - Add-on data
 * @returns Promise with the created add-on
 */
export async function createAddon(
    restaurantId: string,
    data: CreateAddonRequest
): Promise<Addon> {
    try {
        const response = await apiClient.post<Addon>(
            `/api/v1/restaurants/${restaurantId}/addons`,
            data
        );
        console.log('✅ Add-on created:', response);
        return response;
    } catch (error) {
        console.error('❌ Error creating add-on:', error);
        throw error;
    }
}

/**
 * Get all add-ons for a restaurant
 * @param restaurantId - The restaurant ID
 * @returns Promise with array of add-ons
 */
export async function getAddons(restaurantId: string): Promise<Addon[]> {
    try {
        const response = await apiClient.get<Addon[]>(
            `/api/v1/restaurants/${restaurantId}/addons`
        );
        console.log(`✅ Fetched ${response.length} add-ons`);
        return response;
    } catch (error) {
        console.error('❌ Error fetching add-ons:', error);
        throw error;
    }
}

/**
 * Update an add-on
 * @param restaurantId - The restaurant ID
 * @param addonId - The add-on ID
 * @param data - Partial add-on data to update
 * @returns Promise with the updated add-on
 */
export async function updateAddon(
    restaurantId: string,
    addonId: string,
    data: Partial<CreateAddonRequest>
): Promise<Addon> {
    try {
        const response = await apiClient.put<Addon>(
            `/api/v1/restaurants/${restaurantId}/addons/${addonId}`,
            data
        );
        console.log('✅ Add-on updated:', response);
        return response;
    } catch (error) {
        console.error('❌ Error updating add-on:', error);
        throw error;
    }
}

/**
 * Delete an add-on
 * @param restaurantId - The restaurant ID
 * @param addonId - The add-on ID
 * @returns Promise with success message
 */
export async function deleteAddon(
    restaurantId: string,
    addonId: string
): Promise<{ message: string }> {
    try {
        const response = await apiClient.delete<{ message: string }>(
            `/api/v1/restaurants/${restaurantId}/addons/${addonId}`
        );
        console.log('✅ Add-on deleted');
        return response;
    } catch (error) {
        console.error('❌ Error deleting add-on:', error);
        throw error;
    }
}

// ===== Sides =====

/**
 * Create a new side
 * @param restaurantId - The restaurant ID
 * @param data - Side data
 * @returns Promise with the created side
 */
export async function createSide(
    restaurantId: string,
    data: CreateSideRequest
): Promise<Side> {
    try {
        const response = await apiClient.post<Side>(
            `/api/v1/restaurants/${restaurantId}/sides`,
            data
        );
        console.log('✅ Side created:', response);
        return response;
    } catch (error) {
        console.error('❌ Error creating side:', error);
        throw error;
    }
}

/**
 * Get all sides for a restaurant
 * @param restaurantId - The restaurant ID
 * @returns Promise with array of sides
 */
export async function getSides(restaurantId: string): Promise<Side[]> {
    try {
        const response = await apiClient.get<Side[]>(
            `/api/v1/restaurants/${restaurantId}/sides`
        );
        console.log(`✅ Fetched ${response.length} sides`);
        return response;
    } catch (error) {
        console.error('❌ Error fetching sides:', error);
        throw error;
    }
}

/**
 * Update a side
 * @param restaurantId - The restaurant ID
 * @param sideId - The side ID
 * @param data - Partial side data to update
 * @returns Promise with the updated side
 */
export async function updateSide(
    restaurantId: string,
    sideId: string,
    data: Partial<CreateSideRequest>
): Promise<Side> {
    try {
        const response = await apiClient.put<Side>(
            `/api/v1/restaurants/${restaurantId}/sides/${sideId}`,
            data
        );
        console.log('✅ Side updated:', response);
        return response;
    } catch (error) {
        console.error('❌ Error updating side:', error);
        throw error;
    }
}

/**
 * Delete a side
 * @param restaurantId - The restaurant ID
 * @param sideId - The side ID
 * @returns Promise with success message
 */
export async function deleteSide(
    restaurantId: string,
    sideId: string
): Promise<{ message: string }> {
    try {
        const response = await apiClient.delete<{ message: string }>(
            `/api/v1/restaurants/${restaurantId}/sides/${sideId}`
        );
        console.log('✅ Side deleted');
        return response;
    } catch (error) {
        console.error('❌ Error deleting side:', error);
        throw error;
    }
}
