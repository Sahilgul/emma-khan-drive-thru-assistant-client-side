import { useOrder, type OrderData } from '../providers/OrderProvider';

export type { OrderData };

/**
 * Hook to access order data from the persistent OrderProvider context.
 * This ensures that order state is maintained across component transitions
 * and only processes incremental updates once.
 */
export function useOrderData() {
  const { orderData, orderHistory, orderItems, currentPhase, modelPhase, resetOrder } = useOrder();

  return {
    orderData,
    orderHistory,
    orderItems,
    currentPhase,
    modelPhase,
    resetOrder,
    currentItems: orderItems,
  };
}
