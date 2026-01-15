export interface LayoutSettings {
    id: string;
    screenLayout: string;
    backgroundMedia: string | null;
    leftScreen: string | null;
    rightScreen: string | null;
    updatedAt: string;
}

export const fetchLayoutSettings = async (restaurantId: string): Promise<LayoutSettings> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/v1/restaurants/${restaurantId}/settings/layout`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                // Return default/empty settings if not found
                return {
                    id: 'layout',
                    screenLayout: 'Middle Align',
                    backgroundMedia: null,
                    leftScreen: null,
                    rightScreen: null,
                    updatedAt: new Date().toISOString()
                };
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching layout settings:', error);
        throw error;
    }
};

export const saveLayoutSettings = async (
    restaurantId: string,
    data: {
        screenLayout?: string;
        backgroundMedia?: File | null;
        leftScreen?: File | null;
        rightScreen?: File | null;
    }
): Promise<LayoutSettings> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/v1/restaurants/${restaurantId}/settings/layout`;

    const formData = new FormData();
    if (data.screenLayout) {
        formData.append('screenLayout', data.screenLayout);
    }
    if (data.backgroundMedia) {
        formData.append('backgroundMedia', data.backgroundMedia);
    }
    if (data.leftScreen) {
        formData.append('leftScreen', data.leftScreen);
    }
    if (data.rightScreen) {
        formData.append('rightScreen', data.rightScreen);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error saving layout settings:', error);
        throw error;
    }
};
