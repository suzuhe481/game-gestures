import type { EffectInstance } from "@/types/effects/types";
import { EFFECT_TIMING, EFFECT_TOTAL_MS } from "@/types/effects/types";

/**
 * Tick an effect instance's lifecycle forward.
 * Mutates the instance in place (phase, opacity).
 *
 * @param instance - The effect instance to tick.
 * @param now - Current timestamp from requestAnimationFrame.
 */
export function tickEffectLifecycle(
  instance: EffectInstance,
  now: number,
): void {
  const elapsed = now - instance.spawnTime;

  if (elapsed < EFFECT_TIMING.FADE_IN_MS) {
    instance.phase = "fade-in";
    instance.opacity = elapsed / EFFECT_TIMING.FADE_IN_MS;
  } else if (elapsed < EFFECT_TIMING.FADE_IN_MS + EFFECT_TIMING.HOLD_MS) {
    instance.phase = "hold";
    instance.opacity = 1;
  } else if (elapsed < EFFECT_TOTAL_MS) {
    instance.phase = "fade-out";
    const fadeElapsed =
      elapsed - EFFECT_TIMING.FADE_IN_MS - EFFECT_TIMING.HOLD_MS;
    instance.opacity = 1 - fadeElapsed / EFFECT_TIMING.FADE_OUT_MS;
  } else {
    instance.phase = "done";
    instance.opacity = 0;
  }
}
