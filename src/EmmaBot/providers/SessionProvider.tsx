import { createContext, useContext, useMemo } from 'react';
import { RoomContext } from '@livekit/components-react';
import { APP_CONFIG_DEFAULTS, type AppConfig } from '@emma/config/app-config';
import { useRoom } from '@emma/hooks/useRoom';
import { OrderProvider } from './OrderProvider';

const SessionContext = createContext<{
  appConfig: AppConfig;
  isSessionActive: boolean;
  startSession: () => void;
  endSession: () => void;
}>({
  appConfig: APP_CONFIG_DEFAULTS,
  isSessionActive: false,
  startSession: () => { },
  endSession: () => { },
});

interface SessionProviderProps {
  appConfig: AppConfig;
  children: React.ReactNode;
  userId?: string;
}

export const SessionProvider = ({
  appConfig,
  children,
  userId,
}: SessionProviderProps) => {
  const { room, isSessionActive, startSession, endSession } =
    useRoom(appConfig, userId);
  const contextValue = useMemo(
    () => ({ appConfig, isSessionActive, startSession, endSession }),
    [appConfig, isSessionActive, startSession, endSession]
  );

  return (
    <RoomContext.Provider value={room}>
      <SessionContext.Provider value={contextValue}>
        <OrderProvider>
          {children}
        </OrderProvider>
      </SessionContext.Provider>
    </RoomContext.Provider>
  );
};

export function useSession() {
  return useContext(SessionContext);
}
