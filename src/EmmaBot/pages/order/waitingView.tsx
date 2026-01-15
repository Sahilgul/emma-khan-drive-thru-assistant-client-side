import { PUBLIC_ASSETS_IMAGES } from '@emma/assets';
import {
  StartOrderButton,
  StartOrderButtonDescription,
} from '@emma/components/business/startOrderButton';
import { ConnectionStatusIndicator } from '@emma/components/business/connectionStatusIndicator';
import { Image, ImageWrapper } from '@emma/components/common/image';
import { H2, H3, Paragraph } from '@emma/components/ui/typography';
import { cn } from '@emma/lib/utils';
import { useEffect, useState } from 'react';
import type { ConnectionStatus } from '@emma/hooks/useConnectionStatus';

interface WaitingViewProps {
  onStartOrder: () => void;
  isSessionActive?: boolean;
  connectionStatus?: ConnectionStatus;
  connectionError?: string | null;
  backgroundImage?: string | null;
}

export const WaitingView = ({
  onStartOrder,
  isSessionActive = false,
  connectionStatus = 'idle',
  connectionError = null,
  backgroundImage,
}: WaitingViewProps) => {
  const [isSessionStarted, setIsSessionStarted] = useState(isSessionActive);
  const [showButton, setShowButton] = useState(false);

  // Show button after a short delay for smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 800); // Slightly longer delay for better UX

    return () => clearTimeout(timer);
  }, []);

  // Update isSessionStarted when isSessionActive changes
  useEffect(() => {
    if (isSessionActive) {
      setIsSessionStarted(true);
    }
  }, [isSessionActive]);

  // Handle start order button click
  const handleStartOrder = () => {
    console.log('🎯 Starting order flow...');
    setIsSessionStarted(true);
    onStartOrder();
  };

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

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black/80 p-5 2xl:p-10 space-y-20">
          {/* Logo with entrance animation */}
          <ImageWrapper
            className={cn(
              'transition-all duration-1000 delay-200',
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Image
              src={PUBLIC_ASSETS_IMAGES.BrandLogoImg}
              alt="company-logo"
              className="h-auto w-[90%] mx-auto max-w-[400px]"
            />
          </ImageWrapper>

          {/* Main heading with entrance animation */}
          <div
            className={cn(
              'transition-all duration-1000 delay-400',
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <H2 className="text-white font-bold 2xl:text-5xl text-center drop-shadow-lg">
              Hi, I am Emma, your virtual order assistant.
            </H2>
          </div>

          {/* Subheading with entrance animation */}
          <div
            className={cn(
              'transition-all duration-1000 delay-600 flex justify-center',
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <H3 className="text-white font-medium 2xl:text-3xl text-center">
              What would you <br /> like to order today?
            </H3>
          </div>

          {/* Connection Status Indicator - shown when session is active */}
          {isSessionStarted && (
            <div
              className={cn(
                'transition-all duration-500 delay-700 flex justify-center',
                showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <ConnectionStatusIndicator
                status={connectionStatus}
                error={connectionError}
                className="max-w-md"
              />
            </div>
          )}

          {/* Main action area */}
          <div
            className={cn(
              'transition-all duration-1000 delay-800 relative z-50 flex justify-center',
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <div className="space-y-6">
              {/* Start Order Button - hide after session starts */}
              {!isSessionStarted && showButton && (
                <div className="flex flex-col items-center space-y-4">
                  <StartOrderButton
                    onClick={handleStartOrder}
                    isLoading={false}
                    isDisabled={false}
                    size="xl"
                    variant="primary"
                    className="min-w-[300px] transform transition-all duration-500 hover:scale-105"
                  />
                  <StartOrderButtonDescription />
                </div>
              )}

              {/* Loading indicator while button is not shown initially */}
              {!showButton && !isSessionStarted && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <Paragraph className="text-white text-sm">
                      Preparing your experience...
                    </Paragraph>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Model Image with subtle animation */}
          <div className="absolute bottom-0 right-0 transition-all duration-1000 delay-1000">
            <ImageWrapper
              className={cn(
                'transform transition-all duration-1000',
                showButton
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-8'
              )}
            >
              <Image
                src={PUBLIC_ASSETS_IMAGES.AiModelImg}
                className="w-auto h-[50svh] 2xl:h-[65svh] drop-shadow-2xl"
                alt="ai-model-img"
              />
            </ImageWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};
