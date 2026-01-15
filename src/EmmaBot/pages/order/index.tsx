import { useSession } from '@emma/providers/SessionProvider';
import { useUrlState } from '@emma/hooks/useUrlState';
import { useCallback, useMemo, useContext, useEffect, useState } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { useOrderData, useOrderPhase } from '@emma/hooks';
import { useConnectionStatus } from '@emma/hooks/useConnectionStatus';
import { OrderComplete } from './orderComplete';
import { OrderConfirmation } from './orderConfirmation';
import { WaitingView } from './waitingView';
import { AuthContext } from '../../../contexts/AuthContext';
import { fetchLayoutSettings } from '../../../services/layoutService';

export const OrderListing = () => {
  const { currentState, goToCompleted, goToOrdering, goToWaiting } =
    useUrlState();

  // Use session from SessionProvider (single room instance)
  const { isSessionActive, startSession } = useSession();

  // Get room context and order data
  const room = useRoomContext();
  const { currentPhase, modelPhase, orderItems, orderData, resetOrder } = useOrderData();

  // Get user context
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Layout Settings State - only background image for center column
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const loadLayout = async () => {
      if (user?.userId) {
        try {
          const settings = await fetchLayoutSettings(user.userId);
          setBackgroundImage(settings.backgroundMedia);
        } catch (error) {
          console.error("Failed to load layout settings for bot", error);
        }
      }
    };
    loadLayout();
  }, [user?.userId]);

  // Track connection status
  const connectionStatusInfo = useConnectionStatus(room, isSessionActive);

  // Phase transition callbacks
  const phaseCallbacks = useMemo(
    () => ({
      onGreetPhase: () => {
        console.log('📍 On greet phase - staying on waiting view');
        console.log('🔍 DEBUG: Greet phase triggered');
        console.log('🔍 DEBUG: Session active:', isSessionActive);
        console.log('🔍 DEBUG: Room state:', room?.state);
        console.log('🔍 DEBUG: Mic enabled:', room?.localParticipant?.isMicrophoneEnabled);
        // Stay on waiting view while AI greets the user
        // Wait for model_phase to become greet_done
      },
      onGreetDone: () => {
        console.log(
          '📍 On greet_done - waiting 5 seconds before navigating to ordering view'
        );
        // Greeting is done, wait 5 seconds before navigating to ordering view
        setTimeout(() => {
          console.log('📍 5 seconds elapsed - now navigating to ordering view');
          if (currentState !== 'ordering') {
            goToOrdering();
          }
        }, 5000); // 5 second delay
      },
      onOrderingPhase: () => {
        console.log('📍 On ordering phase - user is ordering');
        // User is now ordering, stay on ordering view
      },
      onFinalizingPhase: () => {
        console.log(
          '📍 On finalizing phase - staying on ordering view for confirmation'
        );
        // Stay on ordering view for confirmation
        // UI will update to show "Please confirm your order"
      },
      onCompletedPhase: () => {
        console.log('📍 On completed phase - navigating to completed view');
        // Navigate to completed view when order is completed
        if (currentState !== 'completed') {
          goToCompleted();
        }
        // After 10 seconds, navigate back to waiting view
        // Keep session active - backend will handle new session ID for next order
        setTimeout(() => {
          console.log(
            '📍 10 seconds elapsed - navigating back to waiting view (keeping session active)'
          );
          console.log('🔍 DEBUG: Current session active:', isSessionActive);
          console.log('🔍 DEBUG: Room state:', room?.state);
          console.log('🔍 DEBUG: Mic enabled:', room?.localParticipant?.isMicrophoneEnabled);
          resetOrder();
          goToWaiting();
        }, 10000); // 10 second delay
      },
    }),
    [currentState, goToOrdering, goToCompleted, goToWaiting]
  );

  // Hook to manage order phase transitions
  useOrderPhase(currentPhase, modelPhase, room, phaseCallbacks);

  const handleStartOrder = useCallback(() => {
    console.log('🚀 Starting order session...');
    // Start session - agent will greet first (greet phase)
    // Then transition to ordering phase automatically
    startSession();
  }, [startSession]);

  const handleCompleteOrder = () => {
    goToCompleted();
  };

  const handleReturnToWaiting = () => {
    // Just navigate back to waiting, keep session active
    goToWaiting();
  };

  // Render different UI based on current state
  switch (currentState) {
    case 'waiting':
      return (
        <WaitingView
          onStartOrder={handleStartOrder}
          isSessionActive={isSessionActive}
          connectionStatus={connectionStatusInfo.status}
          connectionError={connectionStatusInfo.error}
          backgroundImage={backgroundImage}
        />
      );
    case 'ordering':
      return (
        <OrderConfirmation
          onCompleteOrder={handleCompleteOrder}
          onReturnToWaiting={handleReturnToWaiting}
          backgroundImage={backgroundImage}
        />
      );
    case 'completed':
      return (
        <OrderComplete
          onReturnToWaiting={handleReturnToWaiting}
          orderItems={orderItems}
          user={user}
          sessionId={orderData?.session_id}
          backgroundImage={backgroundImage}
        />
      );
    default:
      return (
        <WaitingView
          onStartOrder={handleStartOrder}
          connectionStatus={connectionStatusInfo.status}
          connectionError={connectionStatusInfo.error}
          backgroundImage={backgroundImage}
        />
      );
  }
};
