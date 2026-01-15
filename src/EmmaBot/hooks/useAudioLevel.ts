import { useEffect, useState, useRef } from 'react';
import { useLocalParticipant } from '@livekit/components-react';

/**
 * Hook to get real-time audio level from the microphone track
 * Returns normalized audio level (0-1)
 */
export function useAudioLevel(): number {
  const { microphoneTrack } = useLocalParticipant();
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!microphoneTrack?.track) {
      setAudioLevel(0);
      return;
    }

    const track = microphoneTrack.track;

    // Only process if it's an audio track
    if (track.kind !== 'audio') {
      setAudioLevel(0);
      return;
    }

    // Get the underlying MediaStreamTrack from the LiveKit Track
    // LiveKit Track objects have a mediaStreamTrack property at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mediaStreamTrack = (track as any).mediaStreamTrack as
      | MediaStreamTrack
      | undefined;

    if (!mediaStreamTrack) {
      setAudioLevel(0);
      return;
    }

    try {
      // Create audio context for analyzing audio levels
      const AudioContextClass =
        window.AudioContext ||
        (window as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) {
        setAudioLevel(0);
        return;
      }
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(
        new MediaStream([mediaStreamTrack])
      );
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        // Calculate average volume
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        // Normalize to 0-1 range (audio levels are typically 0-255)
        const normalizedLevel = Math.min(average / 128, 1);
        setAudioLevel(normalizedLevel);

        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (analyserRef.current) {
          analyserRef.current.disconnect();
        }
        if (source) {
          source.disconnect();
        }
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(console.error);
        }
      };
    } catch (error) {
      console.warn('Failed to initialize audio level detection:', error);
      setAudioLevel(0);
    }
  }, [microphoneTrack]);

  return audioLevel;
}
