import { KioskLayout } from '@emma/components/layout/kiosk';
import { OrderListing } from '@emma/pages/order';
import { QueryProvider } from '@emma/providers/QueryProvider';
import { SessionProvider } from '@emma/providers/SessionProvider';
import { APP_CONFIG_DEFAULTS } from '@emma/config/app-config';
import { RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { fetchLayoutSettings } from '../services/layoutService';

// Configure LiveKit with drive-thru agent
const appConfig = {
  ...APP_CONFIG_DEFAULTS,
  agentName: 'xpress-to-go-drive-thru-ai-voice-agent',
};

function EmmaBotWrapper() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Layout Settings State
  const [leftImage, setLeftImage] = useState<string | null>(null);
  const [rightImage, setRightImage] = useState<string | null>(null);

  useEffect(() => {
    const loadLayout = async () => {
      if (user?.userId) {
        try {
          const settings = await fetchLayoutSettings(user.userId);
          setLeftImage(settings.leftScreen);
          setRightImage(settings.rightScreen);
        } catch (error) {
          console.error("Failed to load layout settings for bot", error);
        }
      }
    };
    loadLayout();
  }, [user?.userId]);

  return (
    <QueryProvider>
      <SessionProvider appConfig={appConfig} userId={user?.userId}>
        <KioskLayout
          leftPanel={
            leftImage ? (
              <div className="w-full h-full px-1 flex items-center justify-center bg-white absolute inset-0">
                <img
                  src={leftImage}
                  alt="Left Screen"
                  className="w-full h-full object-fill"
                />
              </div>
            ) : null
          }
          centerPanel={<OrderListing />}
          rightPanel={
            rightImage ? (
              <div className="w-full h-full px-1 flex items-center justify-center bg-white absolute inset-0">
                <img
                  src={rightImage}
                  alt="Right Screen"
                  className="w-full h-full object-fill"
                />
              </div>
            ) : null
          }
        />
        <StartAudio label="Start Audio" />
        <RoomAudioRenderer />
      </SessionProvider>
    </QueryProvider>
  );
}

export default EmmaBotWrapper;
