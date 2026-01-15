/* eslint-disable @typescript-eslint/no-unused-vars */
import { PUBLIC_ASSETS_IMAGES } from '@emma/assets';
import { Image } from '@emma/components/common/image';
import { H2 } from '@emma/components/ui/typography';
import { useEffect, useRef } from 'react';
import type { OrderItem } from '@emma/types/order';
import { submitOrder } from '@emma/apis/orders';

interface OrderCompleteProps {
  onReturnToWaiting: () => void;
  orderItems: OrderItem[];
  user: any; // Using any for now to avoid importing User type from context if not exported
  sessionId?: string;
  backgroundImage?: string | null;
}

export const OrderComplete = ({
  onReturnToWaiting: _onReturnToWaiting,
  orderItems,
  user,
  sessionId,
  backgroundImage,
}: OrderCompleteProps) => {
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const submitOrderFn = async () => {
      if (hasSubmitted.current) return;
      hasSubmitted.current = true;

      if (!orderItems || orderItems.length === 0) {
        console.log('No order items to submit');
        return;
      }

      try {
        // Calculate totals
        const itemsTotal = orderItems.reduce((sum, item) => sum + (item.totalPrice || item.price * item.quantity), 0);
        const tax = itemsTotal * 0.07; // Assuming 7% tax as per previous context
        const totalAmount = itemsTotal + tax;

        const payload = {
          restaurantId: user?.userId || 'unknown-restaurant',
          customerId: sessionId || 'guest',
          customerName: 'Guest', // Name is collected on this screen, so we use Guest for now
          orderItems: orderItems,
          tax: parseFloat(tax.toFixed(2)),
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          orderPhase: 'completed'
        };

        console.log('Submitting order payload:', JSON.stringify(payload, null, 2));
        const result = await submitOrder(payload);
        console.log('Order submitted successfully:', result);
      } catch (error) {
        console.error('Error submitting order:', error);
      }
    };

    submitOrderFn();
  }, [orderItems, user, sessionId]);

  return (
    <section className="h-svh w-full overflow-hidden bg-black">
      {/* Main Content Area */}
      <div className="relative h-full w-full overflow-hidden isolate">
        {/* Background Image from API - Centered */}
        {backgroundImage ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              src={backgroundImage}
              alt="Background"
              className="w-full h-full object-center object-cover"
              style={{ objectPosition: 'center' }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 to-black" />
        )}

        <div className="absolute inset-0 bg-black/80 p-5 2xl:p-10 space-y-20">
          <Image
            src={PUBLIC_ASSETS_IMAGES.BrandLogoImg}
            alt="company-logo"
            className="h-auto w-[90%] mx-auto"
          />
          <H2 className="text-white font-bold 2xl:text-5xl text-center">
            Thanks for your order! <br /> Can I get your name please?
          </H2>

          <div className="absolute bottom-0 right-0 w-full">
            <Image
              src={PUBLIC_ASSETS_IMAGES.AiModelImg}
              className="w-auto h-[60svh] translate-x-1/2"
              alt="ai-model-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
