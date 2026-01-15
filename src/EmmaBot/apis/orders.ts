import { createApiClient } from '@emma/lib/api';
import type { OrderItem } from '@emma/types/order';

const apiClient = createApiClient(import.meta.env.VITE_SERVER_URL);

export interface SubmitOrderRequest {
    restaurantId: string;
    customerId: string;
    customerName: string;
    orderItems: OrderItem[];
    tax: number;
    totalAmount: number;
    orderPhase: string;
}

export async function submitOrder(payload: SubmitOrderRequest): Promise<any> {
    try {
        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const fullUrl = `${baseUrl}/orders/`;
        console.log(`🚀 Sending Order to: ${fullUrl}`);
        console.log('📦 Request Payload:', JSON.stringify(payload, null, 2));

        const data = await apiClient.post<any>('/orders/', payload);

        console.log(`✅ Order Submitted!`);
        console.log('📄 Response Data:', JSON.stringify(data, null, 2));

        return data;
    } catch (error) {
        console.error('❌ Error submitting order:', error);
        throw error;
    }
}
