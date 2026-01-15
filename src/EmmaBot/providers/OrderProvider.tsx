import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoomEvent } from 'livekit-client';
import { useRoomContext } from '@livekit/components-react';
import type { OrderItem } from '@emma/types/order';
import { PUBLIC_ASSETS_ICONS } from '@emma/assets';

// Reuse types from useOrderData or a shared types file
export interface LiveKitOrderItem {
    id: string;
    offerCategory?: string;
    title?: string;
    type?: string;
    description?: string;
    withoutItems?: string[];
    withItems?: { id: string; title: string; price: number; type: string }[];
    price?: string;
    size?: string;
    comment?: string;
    quantity?: string;
    _deleted?: boolean;
}

export interface OrderData {
    type: 'order_update';
    session_id?: string;
    orderPhase: 'greet' | 'ordering' | 'finalizing' | 'completed';
    model_phase: 'greet' | 'greet_done' | 'ordering' | 'finalizing' | 'completed';
    orderItems: LiveKitOrderItem[];
    timestamp?: string;
}

interface OrderContextType {
    orderData: OrderData | null;
    orderItems: OrderItem[];
    orderHistory: OrderData[];
    currentPhase: OrderData['orderPhase'] | undefined;
    modelPhase: OrderData['model_phase'] | undefined;
    resetOrder: () => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

function getItemImage(type: string, offerCategory: string): string {
    const typeLower = type.toLowerCase();
    const categoryLower = (offerCategory || '').toLowerCase();

    if (typeLower.includes('burger')) return PUBLIC_ASSETS_ICONS.BurgerIcon;
    if (typeLower.includes('fries') || typeLower.includes('fry')) return PUBLIC_ASSETS_ICONS.FrenchFriesIcon;
    if (typeLower.includes('drink') || typeLower.includes('soda') || typeLower.includes('cola')) return PUBLIC_ASSETS_ICONS.SoftDrinksIcon;
    if (typeLower.includes('wrap')) return PUBLIC_ASSETS_ICONS.WrapIcon;
    if (typeLower.includes('shake') || typeLower.includes('milkshake')) return PUBLIC_ASSETS_ICONS.MilkShakeIcon;
    if (typeLower.includes('cupcake') || typeLower.includes('cake') || typeLower.includes('dessert')) return PUBLIC_ASSETS_ICONS.DessertIcon;
    if (typeLower.includes('coffee')) return PUBLIC_ASSETS_ICONS.CoffeeCupIcon;
    if (typeLower.includes('nuggets')) return PUBLIC_ASSETS_ICONS.NuggetsIcon;
    if (categoryLower.includes('combo')) return PUBLIC_ASSETS_ICONS.ComboDealIcon;

    return PUBLIC_ASSETS_ICONS.BurgerIcon;
}

function convertLiveKitOrderItem(item: LiveKitOrderItem): OrderItem {
    const basePrice = parseFloat(item.price?.replace(/[$,]/g, '') || '0') || 0;
    const quantity = parseInt(item.quantity || '1') || 1;
    const addOnsPrice = (item.withItems || []).reduce((sum, addon) => sum + (addon.price || 0), 0);
    const totalPrice = (basePrice + addOnsPrice) * quantity;

    return {
        id: item.id,
        offerCategory: item.offerCategory || '',
        title: item.title || '',
        type: item.type || '',
        description: item.description || '',
        image: getItemImage(item.type || '', item.offerCategory || ''),
        without: item.withoutItems || [],
        with: (item.withItems || []).map(addon => ({
            id: addon.id,
            title: addon.title,
            price: addon.price,
            type: (addon.type as 'add') || 'add',
        })),
        price: basePrice,
        size: item.size || '',
        comment: item.comment || '',
        quantity,
        totalPrice,
    };
}

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const room = useRoomContext();
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [orderHistory, setOrderHistory] = useState<OrderData[]>([]);
    const [rawItems, setRawItems] = useState<LiveKitOrderItem[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [lastCompletedSessionId, setLastCompletedSessionId] = useState<string | null>(null);

    const resetOrder = () => {
        setOrderData(null);
        setOrderHistory([]);
        setRawItems([]);
        setOrderItems([]);
    };

    useEffect(() => {
        if (!room) return;

        const handleData = (payload: Uint8Array, _participant: any, _kind: any, topic?: string) => {
            if (topic !== 'order_data') return;

            try {
                const decoder = new TextDecoder();
                const jsonString = decoder.decode(payload);
                const data: OrderData = JSON.parse(jsonString);

                if (data.type === 'order_update' && Array.isArray(data.orderItems)) {
                    // Reset items if we're starting a new greet phase with a different session
                    if (data.orderPhase === 'greet' && data.session_id !== lastCompletedSessionId) {
                        setRawItems([]);
                    }

                    if (data.orderPhase === 'completed' && data.session_id) {
                        setLastCompletedSessionId(data.session_id);
                    }

                    setOrderData(data);
                    setOrderHistory(prev => [...prev, data]);

                    setRawItems(prevRaw => {
                        let nextRaw = [...prevRaw];
                        data.orderItems.forEach(incomingItem => {
                            const existingIndex = nextRaw.findIndex(item => item.id === incomingItem.id);
                            if (incomingItem._deleted === true) {
                                if (existingIndex !== -1) nextRaw.splice(existingIndex, 1);
                            } else if (existingIndex !== -1) {
                                nextRaw[existingIndex] = { ...nextRaw[existingIndex], ...incomingItem };
                            } else {
                                nextRaw.push(incomingItem);
                            }
                        });
                        return nextRaw;
                    });
                }
            } catch (error) {
                console.error('❌ Error parsing order data:', error);
            }
        };

        room.on(RoomEvent.DataReceived, handleData);
        return () => {
            room.off(RoomEvent.DataReceived, handleData);
        };
    }, [room]);

    useEffect(() => {
        setOrderItems(rawItems.map(convertLiveKitOrderItem));
    }, [rawItems]);

    const value = {
        orderData,
        orderItems,
        orderHistory,
        currentPhase: orderData?.orderPhase,
        modelPhase: orderData?.model_phase,
        resetOrder,
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrder must be used within an OrderProvider');
    return context;
};
