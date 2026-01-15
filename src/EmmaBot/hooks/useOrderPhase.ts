import { useEffect, useRef } from 'react';
import { Room } from 'livekit-client';

// Match the actual server phases from OrderData
export type OrderPhase = 'greet' | 'ordering' | 'finalizing' | 'completed';
export type ModelPhase =
  | 'greet'
  | 'greet_done'
  | 'ordering'
  | 'finalizing'
  | 'completed';

interface UseOrderPhaseCallbacks {
  onGreetPhase?: () => void;
  onGreetDone?: () => void;
  onOrderingPhase?: () => void;
  onFinalizingPhase?: () => void;
  onCompletedPhase?: () => void;
}

/**
 * Hook to manage order flow based on orderPhase and model_phase from LiveKit
 *
 * Server Flow:
 * orderPhase: greet → ordering → finalizing → completed
 * model_phase: greet → greet_done → ordering → finalizing → completed
 *
 * Our Interpretation:
 * - greet (orderPhase): AI greets the user, stay on waiting view, mic ON
 * - greet_done (model_phase): Greeting finished, navigate to ordering view
 * - ordering: User is ordering, mic ON
 * - finalizing: Agent confirms order, show "Please confirm your order", mic ON
 * - completed: Order finalized, navigate to completed view, mic OFF
 */
export function useOrderPhase(
  currentPhase: OrderPhase | undefined,
  modelPhase: ModelPhase | undefined,
  room: Room | null,
  callbacks: UseOrderPhaseCallbacks
) {
  const previousPhaseRef = useRef<OrderPhase | undefined>(undefined);
  const previousModelPhaseRef = useRef<ModelPhase | undefined>(undefined);
  const isProcessingTransitionRef = useRef(false);

  useEffect(() => {
    if (!room || isProcessingTransitionRef.current) {
      return;
    }

    const previousPhase = previousPhaseRef.current;
    const previousModelPhase = previousModelPhaseRef.current;

    // Check for model_phase changes (priority for greet_done)
    if (modelPhase && previousModelPhase !== modelPhase) {
      console.log(
        `🎭 Model phase transition: ${previousModelPhase} → ${modelPhase}`
      );

      if (modelPhase === 'greet_done') {
        console.log(
          '✅ GREET_DONE: Greeting finished, navigating to ordering view'
        );
        isProcessingTransitionRef.current = true;
        try {
          callbacks.onGreetDone?.();
        } finally {
          previousModelPhaseRef.current = modelPhase;
          isProcessingTransitionRef.current = false;
        }
        return;
      }

      previousModelPhaseRef.current = modelPhase;
    }

    // Only trigger callbacks on phase changes
    if (!currentPhase || previousPhase === currentPhase) {
      return;
    }

    console.log(
      `📊 Order phase transition: ${previousPhase} → ${currentPhase}`
    );
    isProcessingTransitionRef.current = true;

    try {
      switch (currentPhase) {
        case 'greet':
          console.log(
            '👋 GREET phase: AI greeting user, stay on waiting view, mic ON'
          );
          // Microphone already enabled from startSession
          // Stay on waiting view until model_phase becomes greet_done
          callbacks.onGreetPhase?.();
          break;

        case 'ordering':
          console.log('🛒 ORDERING phase: User ordering, mic ON');
          callbacks.onOrderingPhase?.();
          break;

        case 'finalizing':
          console.log(
            '✅ FINALIZING phase: Agent confirming order, mic ON for changes'
          );
          // Keep mic on so user can make changes during confirmation
          // UI will show "Please confirm your order"
          callbacks.onFinalizingPhase?.();
          break;

        case 'completed':
          console.log(
            '🏁 COMPLETED phase: Order finalized, keeping mic ON for next order'
          );
          // Keep microphone enabled - backend will handle session refresh
          // The mic should stay active so the agent can listen for the next order
          console.log('🎤 Microphone staying enabled for next order');
          callbacks.onCompletedPhase?.();
          break;

        default:
          console.warn('⚠️  Unknown order phase:', currentPhase);
      }
    } finally {
      previousPhaseRef.current = currentPhase;
      isProcessingTransitionRef.current = false;
    }
  }, [currentPhase, modelPhase, room, callbacks]);

  return {
    currentPhase,
    modelPhase,
    previousPhase: previousPhaseRef.current,
    previousModelPhase: previousModelPhaseRef.current,
  };
}
