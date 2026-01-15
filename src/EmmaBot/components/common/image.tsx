import { cn } from '@emma/lib/utils';
import React, {
  type ComponentPropsWithoutRef,
  type SyntheticEvent,
  useState,
  useEffect,
} from 'react';

// 1. Image - Core image component with error handling
interface ImageProps extends ComponentPropsWithoutRef<'img'> {
  fallback?: string;
  placeholder?: string;
  retryCount?: number;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  onError,
  fallback = '',
  placeholder = '/icons/fast-food-placholder.png',
  retryCount = 2,
  className,
  ...rest
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retries, setRetries] = useState(0);

  const handleOnError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;

    // Retry with fallback if we haven't exceeded retry count
    if (retries < retryCount && target.src !== fallback && fallback) {
      setRetries(prev => prev + 1);
      setCurrentSrc(fallback);
      return;
    }

    // Use placeholder as final fallback
    if (target.src !== placeholder) {
      setCurrentSrc(placeholder);
    }

    onError?.(e);
  };

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setRetries(0);
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleOnError}
      className={cn('transition-opacity duration-300', className)}
      {...rest}
    />
  );
};

// 2. ImageSkeleton - Loading skeleton component
interface ImageSkeletonProps {
  className?: string;
  show?: boolean;
}

export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  className,
  show = true,
}) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-gray-200 animate-pulse rounded',
        className
      )}
    />
  );
};

// 3. ImageWrapper - Container component for positioning and layout
interface ImageWrapperProps {
  children: React.ReactNode;
  className?: string;
  aspectRatio?: string;
  relative?: boolean;
}

export const ImageWrapper: React.FC<ImageWrapperProps> = ({
  children,
  className,
  aspectRatio,
  relative = true,
}) => {
  return (
    <div
      className={cn(
        relative && 'relative',
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
    >
      {children}
    </div>
  );
};
