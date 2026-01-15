import { useState, useEffect } from 'react';
import { Room, RoomEvent, ConnectionState } from 'livekit-client';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface ConnectionStatusInfo {
    status: ConnectionStatus;
    isRoomConnected: boolean;
    isAgentConnected: boolean;
    isMicEnabled: boolean;
    error: string | null;
}

/**
 * Hook to track WebRTC connection status, agent connection, and microphone status
 */
export function useConnectionStatus(
    room: Room | null,
    isSessionActive: boolean
): ConnectionStatusInfo {
    const [status, setStatus] = useState<ConnectionStatus>('idle');
    const [isRoomConnected, setIsRoomConnected] = useState(false);
    const [isAgentConnected, setIsAgentConnected] = useState(false);
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!room) {
            setStatus('idle');
            setIsRoomConnected(false);
            setIsAgentConnected(false);
            setIsMicEnabled(false);
            return;
        }

        // Set initial status based on session active state
        if (isSessionActive && room.state === 'disconnected') {
            setStatus('connecting');
        }

        // Define updateOverallStatus first so it can be used by all handlers
        const updateOverallStatus = () => {
            const roomConnected = room.state === ConnectionState.Connected;
            const remoteParticipants = Array.from(room.remoteParticipants.values());
            const hasRemoteParticipants = remoteParticipants.length > 0;
            const micEnabled = room.localParticipant?.isMicrophoneEnabled ?? false;

            console.log('🔍 Status check:', {
                roomConnected,
                hasRemoteParticipants,
                participantCount: remoteParticipants.length,
                micEnabled,
            });

            // For voice assistant, we consider it "connected" when:
            // 1. Room is connected
            // 2. Microphone is enabled
            // The agent connection happens automatically in the background
            if (roomConnected && micEnabled) {
                setStatus('connected');
                setIsAgentConnected(hasRemoteParticipants);
                console.log('✅ Fully connected: room + mic ready');
            } else if (roomConnected) {
                setStatus('connecting');
                console.log('⏳ Room connected, waiting for mic...');
            }
        };

        const handleConnectionStateChanged = (state: ConnectionState) => {
            console.log('🔌 Connection state changed:', state);

            if (state === ConnectionState.Connected) {
                setIsRoomConnected(true);
                setError(null);
                console.log('✅ Room connected successfully');
                // Update status immediately when room connects
                updateOverallStatus();
            } else if (state === ConnectionState.Disconnected) {
                setIsRoomConnected(false);
                setIsAgentConnected(false);
                if (isSessionActive) {
                    setStatus('error');
                    setError('Connection lost');
                } else {
                    setStatus('idle');
                }
            } else if (state === ConnectionState.Connecting || state === ConnectionState.Reconnecting) {
                setStatus('connecting');
                setError(null);
            }
        };

        const handleParticipantConnected = (participant: any) => {
            console.log('👤 Participant connected:', {
                identity: participant?.identity,
                name: participant?.name,
                sid: participant?.sid,
            });

            // Check if it's an agent (usually has specific naming or metadata)
            const remoteParticipants = Array.from(room.remoteParticipants.values());
            console.log('📋 All remote participants:', remoteParticipants.map(p => ({
                identity: p.identity,
                name: p.name,
                sid: p.sid,
            })));

            // Consider any remote participant as the agent for now
            // The agent will be the first remote participant to join
            if (remoteParticipants.length > 0) {
                setIsAgentConnected(true);
                console.log('🤖 Agent detected (remote participant joined)');
            }

            updateOverallStatus();
        };

        const handleParticipantDisconnected = () => {
            console.log('👤 Participant disconnected');
            const remoteParticipants = Array.from(room.remoteParticipants.values());

            if (remoteParticipants.length === 0) {
                setIsAgentConnected(false);
                console.log('🤖 No remote participants - agent disconnected');
            }

            updateOverallStatus();
        };

        const handleLocalTrackPublished = () => {
            const micEnabled = room.localParticipant?.isMicrophoneEnabled ?? false;
            setIsMicEnabled(micEnabled);
            console.log('🎤 Microphone status:', micEnabled);
            updateOverallStatus();
        };

        const handleMediaDevicesError = (error: Error) => {
            console.error('❌ Media device error:', error);
            setStatus('error');
            setError(`Microphone error: ${error.message}`);
        };

        // Subscribe to room events
        room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
        room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
        room.on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished);
        room.on(RoomEvent.MediaDevicesError, handleMediaDevicesError);

        // Check initial state
        updateOverallStatus();

        return () => {
            room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
            room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
            room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
            room.off(RoomEvent.LocalTrackPublished, handleLocalTrackPublished);
            room.off(RoomEvent.MediaDevicesError, handleMediaDevicesError);
        };
    }, [room, isSessionActive]);

    return {
        status,
        isRoomConnected,
        isAgentConnected,
        isMicEnabled,
        error,
    };
}
