import { H2, Paragraph } from '../ui/typography';
import { cn } from '@emma/lib/utils';
import { AudioVisualizer } from '../common/audioVisualizer';

interface VoiceHeaderProps {
  isListening?: boolean;
  isProcessing?: boolean;
  title?: string;
  description?: string;
  hideVisualization?: boolean;
}

export const VoiceHeader: React.FC<VoiceHeaderProps> = ({
  isListening = false,
  isProcessing = false,
  title,
  description,
  hideVisualization = false,
}) => {
  return (
    <div className="bg-emma-primary text-white p-1 2xl:p-2 rounded flex items-center justify-between transition-all duration-300 ease-in-out h-[60px] 2xl:h-[80px] shrink-0 overflow-hidden">
      {/* Text Content */}
      <div className="transition-all duration-300 ease-in-out pl-4 2xl:pl-8">
        <H2 className="font-bold transition-all duration-300">{title}</H2>
        <Paragraph className="transition-all duration-300">
          {description}
        </Paragraph>
      </div>

      {/* Audio Visualization Waveform - hide during confirmation */}
      {!hideVisualization && (
        <div className="space-y-5 px-2">
          <AudioVisualizer
            isListening={isListening}
            isProcessing={isProcessing}
          />
          {/* Status Indicator */}
          <div className="flex items-center justify-end space-x-2 transition-all duration-300">
            <span className="text-sm font-medium transition-all duration-300">
              {isListening ? 'Active' : isProcessing ? 'Processing' : 'Ready'}
            </span>
            <div
              className={cn(
                'size-4 rounded-full transition-all duration-300 ease-in-out',
                isListening
                  ? 'bg-green-300 animate-pulse scale-110'
                  : isProcessing
                    ? 'bg-yellow-300 scale-105'
                    : 'bg-green-200 scale-100'
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};
