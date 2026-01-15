/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrderItemCard } from '@emma/components/business/orderItemCard';
import { TotalPrice } from '@emma/components/business/totalPrice';
import { VoiceHeader } from '@emma/components/business/voiceHeader';
import { ScrollArea } from '@emma/components/ui/scroll-area';
import { useOrderData } from '@emma/hooks/useOrderData';
import { useSession } from '@emma/providers/SessionProvider';
import { useEffect, useState } from 'react';

interface OrderConfirmationProps {
  onCompleteOrder: () => void;
  onReturnToWaiting: () => void;
  backgroundImage?: string | null;
}

export const OrderConfirmation = ({
  onCompleteOrder: _onCompleteOrder,
  onReturnToWaiting: _onReturnToWaiting,
  backgroundImage,
}: OrderConfirmationProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { isSessionActive } = useSession();
  const { orderItems, currentPhase } = useOrderData();

  // Check if we're in finalizing phase (confirmation)
  const isConfirmationPhase = currentPhase === 'finalizing';

  // Handle connection state
  useEffect(() => {
    if (isSessionActive) {
      setIsConnecting(false);
      setError(null);
    }
  }, [isSessionActive]);

  const subtotal =
    orderItems.length > 0
      ? orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
      : 0;
  const tax = subtotal * 0.07; // 7% sales tax
  const total = subtotal + tax;

  const getVoiceHeaderTitle = () => {
    // During finalizing phase, show confirmation message
    if (currentPhase === 'finalizing') {
      return 'Please Confirm Your Order';
    }
    // Default to listening message (for ordering phase and initial state)
    return 'Listening to your request';
  };

  const getVoiceHeaderDescription = () => {
    if (error) {
      return `Voice error: ${error}`;
    }

    if (isConnecting) {
      return 'Connecting to voice assistant...';
    }

    // During finalizing phase
    if (currentPhase === 'finalizing') {
      return 'Confirm or make changes to your order';
    }

    // Default to ordering description (for ordering phase and initial state)
    return 'Speak your order or ask questions';
  };

  return (
    <div className="h-svh w-full overflow-hidden">
      {/* Main Content */}
      <div className="p-2 2xl:p-4 flex flex-col gap-3 2xl:gap-5 transition-all duration-500 h-full relative overflow-hidden isolate">
        {/* Background Image from API - Centered */}
        {backgroundImage && (
          <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
            <img
              src={backgroundImage}
              alt="Background"
              className="w-full h-full object-center object-cover"
              style={{ objectPosition: 'center' }}
            />
          </div>
        )}

        {/* Voice Header */}
        <div className="transition-all duration-300 ease-in-out">
          <VoiceHeader
            isListening={isSessionActive && !isConfirmationPhase}
            isProcessing={isConnecting}
            title={getVoiceHeaderTitle()}
            description={getVoiceHeaderDescription()}
            hideVisualization={isConfirmationPhase}
          />
        </div>

        {/* Order Items */}
        <ScrollArea className="flex-1 min-h-0 transition-all duration-500">
          <div className="space-y-2 2xl:space-y-4">
            {/* Item Cards */}
            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className="transition-all duration-300 ease-in-out"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards',
                }}
              >
                <OrderItemCard item={item} />
              </div>
            ))}
          </div>
        </ScrollArea>
        {/* Total Price */}
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            animationDelay: `${(orderItems.length + 1) * 100}ms`,
            animation: 'fadeInUp 0.5s ease-out forwards',
          }}
        >
          <TotalPrice subtotal={subtotal} tax={tax} total={total} />
        </div>
      </div>
    </div>
  );
};
