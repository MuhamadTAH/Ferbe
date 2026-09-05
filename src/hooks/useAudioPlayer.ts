"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface AudioPlayerState {
  activeUrl: string | null;
  isPlaying: boolean;
  error: string | null;
}

/**
 * Centralized audio player hook for HTML5 Audio playback.
 * - Enforces single audio stream (stops existing audio before starting new audio)
 * - Cancels playback on card navigation or unmount via navigationDependency
 * - Exposes active URL tracking and isPlayingUrl helper for UI indicators
 */
export function useAudioPlayer(navigationDependency?: unknown) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Stop any active audio playback and clear audio element
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      audioRef.current = null;
    }
    setActiveUrl(null);
    setIsPlaying(false);
  }, []);

  // Play audio url, stopping any existing audio first
  const play = useCallback(
    (url: string) => {
      if (!url) return;

      // If currently playing the exact same url, pause/stop it
      if (audioRef.current && activeUrl === url && isPlaying) {
        stop();
        return;
      }

      // Mandatory requirement: prevent concurrent audio playback
      stop();
      setError(null);

      try {
        const audio = new Audio(url);
        audioRef.current = audio;
        setActiveUrl(url);
        setIsPlaying(true);

        audio.onended = () => {
          setIsPlaying(false);
          setActiveUrl(null);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setError("Failed to play audio");
          setIsPlaying(false);
          setActiveUrl(null);
          audioRef.current = null;
        };

        audio.play().catch((err) => {
          // Autoplay policy or user gesture requirement
          console.warn("Audio playback interrupted or blocked:", err);
          setError("Audio playback blocked");
          setIsPlaying(false);
          setActiveUrl(null);
          audioRef.current = null;
        });
      } catch (err) {
        setError("Audio initialization error");
        setIsPlaying(false);
        setActiveUrl(null);
      }
    },
    [activeUrl, isPlaying, stop]
  );

  // Helper to test if a specific URL is currently playing
  const isPlayingUrl = useCallback(
    (url?: string | null) => {
      return Boolean(url && activeUrl === url && isPlaying);
    },
    [activeUrl, isPlaying]
  );

  // Mandatory requirement: cancel playback on card navigation
  useEffect(() => {
    stop();
  }, [navigationDependency, stop]);

  return {
    play,
    stop,
    activeUrl,
    isPlaying,
    isPlayingUrl,
    error,
  };
}
