"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Centralized audio player hook for HTML5 Audio playback.
 * - Single audio stream (stops existing audio before starting new audio)
 * - Navigation cancelation via navigationDependency
 * - Tracks failed/unavailable audio URLs (404, network failure, or null)
 * - Playback state is derived from `activeUrl` and updated exclusively inside
 *   media event handlers / user-initiated calls, never synchronously inside
 *   an effect body.
 */
export function useAudioPlayer(navigationDependency?: unknown) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
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

  // Media-level stop: pauses and releases the element without touching React
  // state. The matching `pause` event resets `activeUrl` (see handler below).
  const stopMedia = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audioRef.current = null; // detach first: a queued pause event becomes a no-op for a NEW element
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    } catch {
      // Suppress cleanup errors
    }
  }, []);

  // Mandatory: cancel playback on card navigation (no setState in the effect).
  useEffect(() => {
    stopMedia();
  }, [navigationDependency, stopMedia]);

  const play = useCallback(
    (url?: string | null) => {
      // Guard against null, empty, or known failed URLs
      if (!url || isAudioUnavailable(url)) {
        if (url) markUnavailable(url);
        return;
      }

      // Toggle pause/stop when replaying the exact same URL (user-initiated,
      // so direct state updates are fine here).
      if (audioRef.current && activeUrl === url) {
        stopMedia();
        setActiveUrl(null);
        return;
      }

      stopMedia();
      setError(null);

      try {
        const audio = new Audio();
        audioRef.current = audio;

        const resetIfCurrent = () => {
          // Only the element that owns the current state may reset it; a
          // newer play() call has already taken ownership otherwise.
          setActiveUrl((prev) => (prev === url ? null : prev));
        };

        audio.onended = () => {
          if (audioRef.current === audio) audioRef.current = null;
          resetIfCurrent();
        };

        audio.onpause = () => {
          resetIfCurrent();
        };

        // Capture HTML5 audio error events (e.g. 404, media decode failure)
        audio.onerror = () => {
          if (audioRef.current === audio) audioRef.current = null;
          markUnavailable(url);
          setError("Audio unavailable");
          resetIfCurrent();
        };

        audio.src = url;
        audio.preload = "auto";
        setActiveUrl(url);

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Graceful promise rejection handler (autoplay restrictions, etc.)
            if (audioRef.current === audio) audioRef.current = null;
            markUnavailable(url);
            setError("Audio unavailable");
            resetIfCurrent();
          });
        }
      } catch {
        // Synchronous instantiation error handling
        audioRef.current = null;
        markUnavailable(url);
        setError("Audio unavailable");
        setActiveUrl(null);
      }
    },
    [activeUrl, isAudioUnavailable, markUnavailable, stopMedia]
  );

  // A URL is actively playing when it owns the active slot
  const isPlayingUrl = useCallback(
    (url?: string | null) => {
      return Boolean(url && activeUrl === url);
    },
    [activeUrl]
  );

  return {
    play,
    stop: stopMedia,
    activeUrl,
    isPlaying: activeUrl !== null,
    isPlayingUrl,
    isAudioUnavailable,
    markUnavailable,
    error,
  };
}
