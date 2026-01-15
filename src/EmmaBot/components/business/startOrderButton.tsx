import React from 'react';
import { Button } from '@emma/components/ui/button';
import { H3 } from '@emma/components/ui/typography';
import { cn } from '@emma/lib/utils';

export interface StartOrderButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary';
}

const sizeClasses = {
  sm: 'px-6 py-3 text-lg min-h-[60px]',
  md: 'px-8 py-4 text-xl min-h-[80px]',
  lg: 'px-10 py-5 text-2xl min-h-[100px]',
  xl: 'px-12 py-6 text-3xl min-h-[120px]',
};

const variantClasses = {
  default:
    'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 text-white shadow-2xl hover:shadow-3xl',
  primary:
    'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 text-white shadow-2xl hover:shadow-3xl',
  secondary:
    'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 text-white shadow-2xl hover:shadow-3xl',
};

export const StartOrderButton: React.FC<StartOrderButtonProps> = ({
  onClick,
  isLoading = false,
  isDisabled = false,
  className,
  size = 'lg',
  variant = 'primary',
}) => {
  const handleClick = () => {
    if (!isLoading && !isDisabled) {
      onClick();
    }
  };

  const buttonClasses = cn(
    'glass-button relative overflow-hidden transition-all duration-500 transform',
    'rounded-3xl font-bold tracking-wide',
    'hover:scale-105 active:scale-95',
    'focus:outline-none focus:ring-4 focus:ring-white/20',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    'before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
    'after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-t after:from-black/10 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const loadingSpinner = (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="w-8 h-8 border-4 border-white/20 border-t-white/60 rounded-full animate-spin shadow-lg" />
    </div>
  );

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
      {/* Microphone Icon */}
      <div
        className={cn(
          'transition-all duration-300',
          isLoading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        )}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'transition-all duration-300',
            size === 'xl'
              ? 'w-12 h-12'
              : size === 'lg'
                ? 'w-10 h-10'
                : 'w-8 h-8'
          )}
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>

      {/* Button Text */}
      <div
        className={cn(
          'transition-all duration-300',
          isLoading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        )}
      >
        <H3 className="font-bold text-center leading-tight text-white drop-shadow-lg">
          {isLoading ? 'Starting...' : 'Start the Order'}
        </H3>
        {!isLoading && (
          <p className="text-sm opacity-90 mt-1 text-white/90 drop-shadow-md">
            Click to begin your order
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled || isLoading}
      className={buttonClasses}
      aria-label={isLoading ? 'Starting your order...' : 'Start the order'}
      aria-describedby="start-order-description"
    >
      {/* Glass highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

      {/* Loading overlay */}
      {isLoading && loadingSpinner}

      {/* Button content */}
      {content}

      {/* Subtle glow animation when ready */}
      {!isLoading && !isDisabled && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/10 to-white/5 animate-pulse opacity-40" />
      )}
    </Button>
  );
};

// Description for screen readers
export const StartOrderButtonDescription: React.FC = () => (
  <div id="start-order-description" className="sr-only">
    Click this button to start your order. Emma, your virtual assistant, will
    greet you and help you place your order.
  </div>
);
