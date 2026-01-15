import { cn } from '@emma/lib/utils';
import type { ConnectionStatus } from '@emma/hooks/useConnectionStatus';

interface ConnectionStatusIndicatorProps {
    status: ConnectionStatus;
    error?: string | null;
    className?: string;
}

export const ConnectionStatusIndicator = ({
    status,
    error,
    className,
}: ConnectionStatusIndicatorProps) => {
    if (status === 'idle') {
        return null; // Don't show anything when idle
    }

    return (
        <div
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-sm transition-all duration-300',
                status === 'connecting' && 'bg-blue-500/20 border border-blue-500/30',
                status === 'connected' && 'bg-green-500/20 border border-green-500/30',
                status === 'error' && 'bg-red-500/20 border border-red-500/30',
                className
            )}
        >
            {/* Status Indicator Dot */}
            <div className="relative flex items-center justify-center">
                {status === 'connecting' && (
                    <>
                        {/* Pulsing loader */}
                        <div className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75" />
                        <div className="relative w-3 h-3 bg-blue-500 rounded-full" />
                    </>
                )}

                {status === 'connected' && (
                    <>
                        {/* Pulsing green dot */}
                        <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-pulse opacity-75" />
                        <div className="relative w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                    </>
                )}

                {status === 'error' && (
                    <>
                        {/* Pulsing red dot */}
                        <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse opacity-75" />
                        <div className="relative w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                    </>
                )}
            </div>

            {/* Status Text */}
            <div className="flex flex-col">
                <span
                    className={cn(
                        'text-sm font-semibold',
                        status === 'connecting' && 'text-blue-200',
                        status === 'connected' && 'text-green-200',
                        status === 'error' && 'text-red-200'
                    )}
                >
                    {status === 'connecting' && 'Connecting to Emma...'}
                    {status === 'connected' && 'Emma is Active'}
                    {status === 'error' && 'Connection Error'}
                </span>

                {error && status === 'error' && (
                    <span className="text-xs text-red-300 mt-0.5">{error}</span>
                )}

                {status === 'connecting' && (
                    <span className="text-xs text-blue-300 mt-0.5">
                        Please wait while we connect you
                    </span>
                )}
            </div>

            {/* Loading spinner for connecting state */}
            {status === 'connecting' && (
                <div className="ml-auto">
                    <div className="w-5 h-5 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};
