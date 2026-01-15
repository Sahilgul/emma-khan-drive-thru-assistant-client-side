import React from 'react';
import { useAudioLevel } from '@emma/hooks/useAudioLevel';
import { cn } from '@emma/lib/utils';

export const AudioVisualizer: React.FC<{
  bars?: number;
  isListening: boolean;
  isProcessing: boolean;
}> = ({ bars = 9, isListening, isProcessing }) => {
  const audioLevel = useAudioLevel();
  const shouldShowVisualization = isListening || isProcessing;

  // Generate waveform bars based on audio level or use animated bars
  const getBarHeight = (index: number) => {
    if (isListening && audioLevel > 0) {
      // Use real audio level with slight variation per bar
      const baseHeight = audioLevel * 100;
      const variation = Math.sin((index / bars) * Math.PI * 2) * 0.3;
      return Math.max(20, Math.min(100, baseHeight + variation * 50));
    }

    // Fallback animated bars when not actively listening
    if (isProcessing) {
      return 60;
    }

    return 30;
  };

  return (
    <div className="flex items-end gap-1.5 h-10">
      {Array.from({ length: bars }).map((_, index) => {
        const height = getBarHeight(index);

        return (
          <div
            key={index}
            className={cn(
              'w-1.5 bg-white rounded-full transition-all duration-150 ease-out',
              shouldShowVisualization
                ? 'opacity-100 animate-pulse'
                : 'opacity-40'
            )}
            style={{
              height: `${height}%`,
              minHeight: '8px',
              maxHeight: '40px',
              animationDelay: shouldShowVisualization
                ? `${index * 0.08}s`
                : '0s',
            }}
          />
        );
      })}
    </div>
  );
};
