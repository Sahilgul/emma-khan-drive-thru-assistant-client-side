import { QueryClient } from '@tanstack/react-query';

interface HttpError extends Error {
  status?: number;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount: number, error: unknown) => {
        // Narrow error type safely
        const status = (error as HttpError)?.status;

        // Don't retry on 4xx errors
        if (typeof status === 'number' && status >= 400 && status < 500) {
          return false;
        }

        // Retry up to 3 times
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
