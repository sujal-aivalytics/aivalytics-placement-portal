'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type React from 'react';

export type ViolationType =
  | 'fullscreen_exit'
  | 'tab_switch'
  | 'window_blur'
  | 'look_away'
  | 'copy_paste'
  | 'right_click'
  | 'keyboard_shortcut';

export interface ViolationLog {
  type: ViolationType;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface ViolationDetectionConfig {
  maxWarnings: number;
  onViolation: (violation: ViolationLog) => void;
  onMaxViolations: (violations: ViolationLog[]) => void;
  enabled: boolean;
  videoElement?: HTMLVideoElement | null;
  videoElementRef?: React.RefObject<HTMLVideoElement | null>;
  faceDetectionEnabled?: boolean;
  faceAwayThreshold?: number; // seconds
}

/**
 * Custom hook for detecting exam violations
 * 
 * Detects:
 * 1. Fullscreen exit
 * 2. Tab switching / Window blur
 * 3. Looking away from camera (face detection)
 * 4. Copy/Paste/Right click
 * 5. Keyboard shortcuts (Alt+Tab, Ctrl+Tab, Alt+F4)
 */
export function useViolationDetection(config: ViolationDetectionConfig) {
  const {
    maxWarnings = 3,
    onViolation,
    onMaxViolations,
    enabled,
    videoElement: videoElementProp,
    videoElementRef,
    faceDetectionEnabled = true,
    faceAwayThreshold = 5,
  } = config;

  // Get video element from prop or ref
  const getVideoElement = useCallback(() => {
    return videoElementProp || videoElementRef?.current || null;
  }, [videoElementProp, videoElementRef]);

  const [warningCount, setWarningCount] = useState(0);
  const violationsRef = useRef<ViolationLog[]>([]);
  const faceDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceAwayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFaceDetectedRef = useRef<number>(0);

  useEffect(() => {
    lastFaceDetectedRef.current = Date.now();
  }, []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  /**
   * Central violation handler
   * Increments warning count and triggers callbacks
   */
  const handleViolation = useCallback(
    (type: ViolationType, metadata?: Record<string, unknown>) => {
      if (!enabled) return;
      // Prevent further violations if we've already reached the limit
      if (warningCount >= maxWarnings) return;

      const violation: ViolationLog = {
        type,
        timestamp: Date.now(),
        metadata,
      };

      violationsRef.current.push(violation);
      const newWarningCount = warningCount + 1;
      setWarningCount(newWarningCount);

      // Trigger violation callback
      onViolation(violation);

      // If max violations reached, trigger auto-submit
      if (newWarningCount === maxWarnings) {
        onMaxViolations([...violationsRef.current]);
      }
    },
    [enabled, warningCount, maxWarnings, onViolation, onMaxViolations]
  );

  /**
   * 1. Fullscreen Exit Detection
   */
  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(
        document.fullscreenElement ||
        (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as Document & { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as Document & { msFullscreenElement?: Element }).msFullscreenElement
      );

      if (!isFullscreen) {
        handleViolation('fullscreen_exit', {
          reason: 'User exited fullscreen mode',
        });
      }
    };

    // Listen to all fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [enabled, handleViolation]);

  /**
   * 2. Tab Switching / Window Blur Detection
   */
  useEffect(() => {
    if (!enabled) return;

    let blurTime: number | null = null;
    const BLUR_THRESHOLD = 100; // Minimum blur duration in ms to count as violation

    const handleVisibilityChange = () => {
      if (document.hidden) {
        blurTime = Date.now();
      } else if (blurTime !== null) {
        const blurDuration = Date.now() - blurTime;
        if (blurDuration > BLUR_THRESHOLD) {
          handleViolation('tab_switch', {
            duration: blurDuration,
            reason: 'Tab or window was switched',
          });
        }
        blurTime = null;
      }
    };

    const handleBlur = () => {
      blurTime = Date.now();
    };

    const handleFocus = () => {
      if (blurTime !== null) {
        const blurDuration = Date.now() - blurTime;
        if (blurDuration > BLUR_THRESHOLD) {
          handleViolation('window_blur', {
            duration: blurDuration,
            reason: 'Window lost focus',
          });
        }
        blurTime = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [enabled, handleViolation]);

  /**
   * 3. Copy/Paste/Right Click Detection
   */
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      handleViolation('right_click', {
        reason: 'Right click context menu attempted',
      });
      return false;
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      handleViolation('copy_paste', {
        action: 'copy',
        reason: 'Copy operation attempted',
      });
      return false;
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      handleViolation('copy_paste', {
        action: 'paste',
        reason: 'Paste operation attempted',
      });
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      handleViolation('copy_paste', {
        action: 'cut',
        reason: 'Cut operation attempted',
      });
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          handleViolation('copy_paste', {
            action: 'copy',
            shortcut: 'Ctrl+C',
            reason: 'Copy shortcut attempted',
          });
        } else if (e.key === 'v' || e.key === 'V') {
          e.preventDefault();
          handleViolation('copy_paste', {
            action: 'paste',
            shortcut: 'Ctrl+V',
            reason: 'Paste shortcut attempted',
          });
        } else if (e.key === 'x' || e.key === 'X') {
          e.preventDefault();
          handleViolation('copy_paste', {
            action: 'cut',
            shortcut: 'Ctrl+X',
            reason: 'Cut shortcut attempted',
          });
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleViolation]);

  /**
   * 4. Keyboard Shortcuts Detection (Alt+Tab, Ctrl+Tab, Alt+F4)
   */
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Tab (Alt key + Tab key)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        handleViolation('keyboard_shortcut', {
          shortcut: 'Alt+Tab',
          reason: 'Application switching shortcut attempted',
        });
      }

      // Ctrl+Tab (browser tab switching)
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault();
        handleViolation('keyboard_shortcut', {
          shortcut: 'Ctrl+Tab',
          reason: 'Tab switching shortcut attempted',
        });
      }

      // Alt+F4 (window close)
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        handleViolation('keyboard_shortcut', {
          shortcut: 'Alt+F4',
          reason: 'Window close shortcut attempted',
        });
      }

      // F11 (fullscreen toggle - allow but log)
      if (e.key === 'F11') {
        // Allow F11 but we'll detect fullscreen exit separately
        // This is just for logging
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleViolation]);

  /**
   * 5. Face Detection - Looking Away from Camera
   * 
   * This is a simplified face detection implementation.
   * For production, consider using:
   * - @tensorflow-models/face-landmarks-detection
   * - face-api.js
   * - MediaPipe Face Detection
   * 
   * Current implementation uses basic canvas analysis to detect face presence.
   * Backend API call should be made here for more accurate face detection.
   */
  useEffect(() => {
    if (!enabled || !faceDetectionEnabled) return;

    const videoElement = getVideoElement();
    if (!videoElement) return;

    // Initialize canvas for face detection
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 320;
      canvasRef.current.height = 240;
      contextRef.current = canvasRef.current.getContext('2d', { willReadFrequently: true });
    }

    const canvas = canvasRef.current;
    const ctx = contextRef.current;

    if (!canvas || !ctx) return;

    /**
     * Basic face detection using image analysis
     * This is a simplified approach - for production, use a proper ML model
     */
    const detectFace = () => {
      if (!videoElement || videoElement.readyState !== 4) return false;

      try {
        // Draw video frame to canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Basic skin tone detection (simplified)
        // In production, use proper face detection API
        let skinPixels = 0;
        let totalPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // YCbCr skin detection (more robust than RGB)
          // Y = 0.299R + 0.587G + 0.114B
          // Cb = -0.169R - 0.331G + 0.500B + 128
          // Cr = 0.500R - 0.419G - 0.081B + 128

          const y = 0.299 * r + 0.587 * g + 0.114 * b;
          const cb = -0.169 * r - 0.331 * g + 0.500 * b + 128;
          const cr = 0.500 * r - 0.419 * g - 0.081 * b + 128;

          // Skin color range in YCbCr
          if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173) {
            skinPixels++;
          }

          // Also keep a relaxed RGB check as fallback/union
          // to catch cases where YCbCr might miss
          else if (
            r > 60 && g > 40 && b > 20 &&
            Math.max(r, g, b) - Math.min(r, g, b) > 10 &&
            Math.abs(r - g) > 10 &&
            r > g && r > b
          ) {
            skinPixels++;
          }

          totalPixels++;
        }

        const skinRatio = skinPixels / totalPixels;
        // Lower threshold to avoid false positives (was 0.15)
        return skinRatio > 0.04;
      } catch (error) {
        console.error('Face detection error:', error);
        return false;
      }
    };

    /**
     * Enhanced face detection using backend API
     * TODO: Replace this with actual API call to your backend
     * 
     * Example API call:
     * const response = await fetch('/api/proctoring/detect-face', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ imageData: canvas.toDataURL() })
     * });
     * const { hasFace, faceDirection } = await response.json();
     */
    const detectFaceWithAPI = async () => {
      if (!videoElement || videoElement.readyState !== 4) return false;

      try {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);

        // TODO: Make API call to backend for face detection
        // For now, fallback to basic detection
        // const response = await fetch('/api/proctoring/detect-face', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ imageData })
        // });
        // if (response.ok) {
        //   const result = await response.json();
        //   return result.hasFace && result.faceDirection === 'front';
        // }

        return detectFace();
      } catch (error) {
        console.error('API face detection error:', error);
        return detectFace();
      }
    };

    // Run face detection periodically
    faceDetectionIntervalRef.current = setInterval(async () => {
      const hasFace = await detectFaceWithAPI();
      const now = Date.now();

      if (hasFace) {
        lastFaceDetectedRef.current = now;
        // Clear any existing away timer
        if (faceAwayTimerRef.current) {
          clearTimeout(faceAwayTimerRef.current);
          faceAwayTimerRef.current = null;
        }
      } else {
        // Check if face has been away for threshold duration
        const timeSinceLastFace = (now - lastFaceDetectedRef.current) / 1000;

        if (timeSinceLastFace >= faceAwayThreshold && !faceAwayTimerRef.current) {
          // Set timer to trigger violation after threshold
          faceAwayTimerRef.current = setTimeout(() => {
            handleViolation('look_away', {
              duration: timeSinceLastFace,
              threshold: faceAwayThreshold,
              reason: `Face not detected for ${faceAwayThreshold} seconds`,
            });
            faceAwayTimerRef.current = null;
          }, (faceAwayThreshold - timeSinceLastFace) * 1000);
        }
      }
    }, 500); // Check every 500ms

    return () => {
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
        faceDetectionIntervalRef.current = null;
      }
      if (faceAwayTimerRef.current) {
        clearTimeout(faceAwayTimerRef.current);
        faceAwayTimerRef.current = null;
      }
    };
  }, [enabled, faceDetectionEnabled, faceAwayThreshold, handleViolation, getVideoElement]);

  /**
   * Reset violations (useful when exam restarts)
   */
  const resetViolations = useCallback(() => {
    setWarningCount(0);
    violationsRef.current = [];
    lastFaceDetectedRef.current = Date.now();
  }, []);

  return {
    warningCount,
    violations: violationsRef.current,
    resetViolations,
  };
}

