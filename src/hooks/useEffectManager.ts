import { useEffect, useRef, type RefObject } from "react";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { useEffectsStore } from "@/store/effects-store";
import { tickEffectLifecycle } from "@/lib/effects/effectLifecycle";
import { clamp } from "@/lib/math/math";
import {
  EFFECT_MAX_SIZE_FRACTION,
  EFFECT_MIN_SIZE_FRACTION,
  EFFECT_SIZE_FRACTION,
  EFFECT_Y_OFFSET,
  EFFECT_MIN_Y_OFFSET,
  EFFECT_MAX_Y_OFFSET,
  REFERENCE_HAND_SCALE,
} from "@/types/effects/types";
import type { EffectInstance } from "@/types/effects/types";
import type { GestureSnapshot } from "@/types/gestures/types";

/**
 * Manage active effect instances.
 *
 * Polls gestureRef each frame. When a "confirmed" event fires and the
 * selected effect's gesture matches, spawns a new EffectInstance at
 * a fixed position above the thumb tip.
 *
 * Ticks all active instances through their lifecycle each frame and
 * removes completed ones.
 *
 * @param gestureRef - Ref to the current GestureSnapshot from useGestureDetection.
 * @param active - Whether the effect manager loop should run.
 * @returns Ref to the array of active EffectInstance objects.
 */
export function useEffectManager(
  gestureRef: RefObject<GestureSnapshot | null>,
  active: boolean,
): RefObject<EffectInstance[]> {
  const instancesRef = useRef<EffectInstance[]>([]);
  const nextIdRef = useRef(0);

  const selectedGesture = useEffectsStore((s) => {
    const effect = s.effects.find((e) => e.id === s.selectedEffectId);
    return effect?.gesture ?? null;
  });

  const selectedGestureRef = useRef(selectedGesture);

  useEffect(() => {
    selectedGestureRef.current = selectedGesture;
  });

  useAnimationFrame((time) => {
    const snapshot = gestureRef.current;

    // Spawn new effects on confirmed events
    if (snapshot && selectedGestureRef.current === "thumbs-up") {
      for (const hand of [snapshot.left, snapshot.right] as const) {
        if (hand.event === "confirmed" && hand.state.confirmedData) {
          const { thumbTipPosition, handScale } = hand.state.confirmedData;

          const scaleRatio = handScale / REFERENCE_HAND_SCALE;

          const sizeFraction = clamp(
            EFFECT_SIZE_FRACTION * scaleRatio,
            EFFECT_MIN_SIZE_FRACTION,
            EFFECT_MAX_SIZE_FRACTION,
          );

          const yOffset = clamp(
            EFFECT_Y_OFFSET * scaleRatio,
            EFFECT_MIN_Y_OFFSET,
            EFFECT_MAX_Y_OFFSET,
          );

          instancesRef.current.push({
            id: nextIdRef.current++,
            x: thumbTipPosition.x,
            y: thumbTipPosition.y,
            sizeFraction,
            yOffset,
            spawnTime: time,
            phase: "fade-in",
            opacity: 0,
          });
        }
      }
    }

    // Tick all active instances
    for (const instance of instancesRef.current) {
      tickEffectLifecycle(instance, time);
    }

    // Prune completed instances
    instancesRef.current = instancesRef.current.filter(
      (inst) => inst.phase !== "done",
    );
  }, active);

  return instancesRef;
}
