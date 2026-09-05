"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface AudioPlayerState {
  activeUrl: string | null;
  isPlaying: boolean;
  error: string | null;
}

/**
 * Centralized audio player hook for HTML5 Audio playback.
 * - Single audio stream (stops existing audio before starting new audio)
 * - Navigation cancelation via navigationDependency
 * - Tracks failed/unavailable audio URLs (404, network failure, or null)
 * - Safe error handling without unhandled runtime rejections or crashes
 */
export function useAudioPlayer(navigationDependency?: unknown) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  // Check if a URL is unavailable (null, undefined, empty, or previously failed)
  const isAudioUnavailable = useCallback(
    (url?: string | null) => {
      if (!url || typeof url !== "string" || url.trim() === "") {
        return true;
      }
      return failedUrls.has(url);
    },
    [failedUrls]
  );

  // Mark a specific URL as permanently unavailable for this session
  const markUnavailable = useCallback((url?: string | null) => {
    if (!url) return;
    setFailedUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  // Stop any active audio playback and release resources
  const stop = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      } catch {
        // Suppress cleanup errors
      }
      audioRef.current = null;
    }
    setActiveUrl(null);
    setIsPlaying(false);
  }, []);

  // Play audio url, stopping any existing audio first
  const play = useCallback(
    (url?: string | null) => {
      // Guard against null, empty, or known failed URLs
      if (!url || isAudioUnavailable(url)) {
        if (url) markUnavailable(url);
        return;
      }

      // If currently playing the exact same url, toggle pause/stop
      if (audioRef.current && activeUrl === url && isPlaying) {
        stop();
        return;
      }

      // Prevent concurrent playback: always stop existing audio first
      stop();
      setError(null);

      try {
        const audio = new Audio();
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          setActiveUrl(null);
          audioRef.current = null;
        };

        // Capture HTML5 audio error events (e.g. 404, media decode failure, bad source)
        audio.onerror = () => {
          markUnavailable(url);
          setError("Audio unavailable");
          setIsPlaying(false);
          setActiveUrl(null);
          audioRef.current = null;
        };

        audio.src = url;
        audio.preload = "auto";
        setActiveUrl(url);
        setIsPlaying(true);

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err: unknown) => {
            // Graceful promise rejection handler (e.g. network 404 or autoplay restrictions)
            markUnavailable(url);
            setError("Audio unavailable");
            setIsPlaying(false);
            setActiveUrl(null);
            audioRef.current = null;
          });
        }
      } catch (err: unknown) {
        // Synchronous instantiation error handling
        markUnavailable(url);
        setError("Audio unavailable");
        setIsPlaying(false);
        setActiveUrl(null);
        audioRef.current = null;
      }
    },
    [activeUrl, isPlaying, isAudioUnavailable, markUnavailable, stop]
  );

  // Helper to check if a specific URL is currently actively playing
  const isPlayingUrl = useCallback(
    (url?: string | null) => {
      return Boolean(url && activeUrl === url && isPlaying);
    },
    [activeUrl, isPlaying]
  );

  // Mandatory: Cancel playback on card navigation
  useEffect(() => {
    stop();
  }, [navigationDependency, stop]);

  return {
    play,
    stop,
    activeUrl,
    isPlaying,
    isPlayingUrl,
    isAudioUnavailable,
    markUnavailable,
    error,
  };
}
