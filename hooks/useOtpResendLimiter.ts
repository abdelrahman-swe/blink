"use client";

import { useEffect, useState } from "react";

const ONE_MINUTE = 60;
const BLOCK_TIME = 15 * 60;
const MAX_ATTEMPTS = 2; // Default attempts if not provided
const BASE_STORAGE_KEY = "otp-resend-limiter";

type Mode = "cooldown" | "blocked" | null;

type StoredState = {
  attempts: number;
  mode: Mode;
  expiresAt: number | null;
};

export function useOtpResendLimiter(context: string = "default", maxAttempts: number = 2, uniqueId?: string) {

  const getStorageKey = (id?: string) => {
    if (id) return `${BASE_STORAGE_KEY}-${context}-${id}`;
    if (uniqueId) return `${BASE_STORAGE_KEY}-${context}-${uniqueId}`;
    return `${BASE_STORAGE_KEY}-${context}`;
  };

  const currentKey = getStorageKey();

  const [attempts, setAttempts] = useState(0);
  const [mode, setMode] = useState<Mode>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  /* ---------- Restore state or Start Initial Cooldown ---------- */
  useEffect(() => {
    // If uniqueId is undefined (e.g. ForgetPasswordForm init), we might not want to load anything
    // OR we load the generic context state. 
    // For Verify pages, uniqueId is present, so we load that specific state.

    const key = getStorageKey();
    const saved = localStorage.getItem(key);

    if (saved) {
      const parsed: StoredState = JSON.parse(saved);
      const now = Date.now();

      if (parsed.expiresAt && parsed.expiresAt > now) {
        setAttempts(parsed.attempts);
        setMode(parsed.mode);
        setRemainingSeconds(Math.ceil((parsed.expiresAt - now) / 1000));
      } else {
        // Clear expired state but preserve attempt count if it's not a block
        const newAttempts = parsed.mode === "blocked" ? 0 : parsed.attempts;
        setAttempts(newAttempts);
        localStorage.removeItem(key);
      }
    } else {

      const now = Date.now();
      const expiresAt = now + ONE_MINUTE * 1000;

      setMode("cooldown");
      setRemainingSeconds(ONE_MINUTE);
      setAttempts(0);

      save({
        attempts: 0,
        mode: "cooldown",
        expiresAt,
      });
    }
  }, [currentKey]); 

  /* ---------- Countdown ---------- */
  useEffect(() => {
    if (!remainingSeconds || !mode) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (!prev || prev <= 1) {
          if (mode === "blocked") {
            setAttempts(0);
          }
          setMode(null);
          setRemainingSeconds(null);
          localStorage.removeItem(currentKey);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, mode, currentKey]);

  const save = (state: StoredState, targetId?: string) => {
    localStorage.setItem(getStorageKey(targetId), JSON.stringify(state));
  };

  const reset = () => {
    setAttempts(0);
    setMode(null);
    setRemainingSeconds(null);
    localStorage.removeItem(currentKey);
  };

  /* ---------- Call ONLY after successful resend ---------- */
  const triggerBlock = (duration: number = BLOCK_TIME, targetId?: string) => {
    const now = Date.now();
    const expiresAt = now + duration * 1000;

    if (targetId && targetId !== uniqueId) {
      const state: StoredState = {
        attempts: 0,
        mode: "blocked",
        expiresAt,
      };
      localStorage.setItem(getStorageKey(targetId), JSON.stringify(state));
      return;
    }

    setMode("blocked");
    setRemainingSeconds(duration);
    setAttempts(0);

    save({
      attempts: 0,
      mode: "blocked",
      expiresAt,
    });
  };

  const onResendSuccess = () => {
    const now = Date.now();

    // 🔴 Block for 15 minutes
    if (attempts >= maxAttempts) {
      const expiresAt = now + BLOCK_TIME * 1000;

      setMode("blocked");
      setRemainingSeconds(BLOCK_TIME);
      setAttempts(0);

      save({
        attempts: 0,
        mode: "blocked",
        expiresAt,
      });

      return;
    }

    // 🟡 1-minute cooldown
    const expiresAt = now + ONE_MINUTE * 1000;

    setMode("cooldown");
    setRemainingSeconds(ONE_MINUTE);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    save({
      attempts: newAttempts,
      mode: "cooldown",
      expiresAt,
    });
  };

  return {
    isBlocked: mode === "blocked",
    isCooldown: mode === "cooldown",
    remainingSeconds,
    onResendSuccess,
    triggerBlock,
  };
}
