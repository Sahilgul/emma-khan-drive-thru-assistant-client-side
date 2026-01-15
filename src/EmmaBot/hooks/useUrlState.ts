import { useState, useEffect, useCallback } from 'react';

export type OrderState = 'waiting' | 'ordering' | 'completed';

export const useUrlState = () => {
  const [currentState, setCurrentState] = useState<OrderState>('waiting');

  // Update URL with new state
  const updateUrlState = useCallback((newState: OrderState) => {
    const url = new URL(window.location.href);

    url.searchParams.set('state', newState);

    window.history.replaceState({}, '', url.toString());

    setCurrentState(newState);
  }, []);

  // Get state from URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state') as OrderState;

    if (state && ['waiting', 'ordering', 'completed'].includes(state)) {
      setCurrentState(state);
    } else {
      // Set default state in URL if none exists
      updateUrlState('waiting');
    }
  }, [updateUrlState]);

  // State navigation functions
  const goToWaiting = useCallback(
    () => updateUrlState('waiting'),
    [updateUrlState]
  );

  const goToOrdering = useCallback(
    () => updateUrlState('ordering'),
    [updateUrlState]
  );

  const goToCompleted = useCallback(
    () => updateUrlState('completed'),
    [updateUrlState]
  );

  return {
    currentState,
    goToWaiting,
    goToOrdering,
    goToCompleted,
  };
};
