import { useEffect, useRef, type RefObject } from "react";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { useEffectsStore } from "@/store/effects-store";
import { useAudioStore } from "@/store/audio-store";
import { initAudioContext, playClip, setMuted } from "@/lib/audio/audioEngine";
import { selectClip } from "@/lib/audio/clipSelection";
import type { GestureSnapshot } from "@/types/gestures/types";

/**
 * Audio playback hook.
 *
 * Polls gestureRef each frame. When a "confirmed" event fires and the
 * selected effect's gesture matches, selects an audio clip (considering
 * double-gesture logic) and plays it.
 *
 * @param gestureRef - Ref to the current GestureSnapshot from useGestureDetection.
 * @param active - Whether the audio loop should run.
 */
export function useAudio(
  gestureRef: RefObject<GestureSnapshot | null>,
  active: boolean,
): void {
  const lastTriggerRef = useRef<number | null>(null);

  const selectedGesture = useEffectsStore((s) => {
    const effect = s.effects.find((e) => e.id === s.selectedEffectId);
    return effect?.gesture ?? null;
  });

  const selectedGestureRef = useRef(selectedGesture);

  useEffect(() => {
    selectedGestureRef.current = selectedGesture;
  });

  const isMuted = useAudioStore((s) => s.isMuted);

  useEffect(() => {
    setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    initAudioContext();
  }, []);

  useAnimationFrame((time) => {
    const snapshot = gestureRef.current;
    if (!snapshot || selectedGestureRef.current !== "thumbs-up") return;

    for (const hand of [snapshot.left, snapshot.right] as const) {
      if (hand.event === "confirmed" && hand.state.confirmedData) {
        const clip = selectClip(lastTriggerRef.current, time);
        playClip(clip);
        lastTriggerRef.current = time;
      }
    }
  }, active);
}
