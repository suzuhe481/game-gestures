/** Phase of an effect instance's lifecycle. */
export type EffectLifecyclePhase = "fade-in" | "hold" | "fade-out" | "done";

/** Timing constants for effect lifecycle phases (ms). */
export const EFFECT_TIMING = {
  FADE_IN_MS: 0,
  HOLD_MS: 1500,
  FADE_OUT_MS: 0,
} as const;

/** Total lifetime of an effect in milliseconds. */
export const EFFECT_TOTAL_MS =
  EFFECT_TIMING.FADE_IN_MS + EFFECT_TIMING.HOLD_MS + EFFECT_TIMING.FADE_OUT_MS;

/** Base size of the effect as a fraction of drawH (at reference hand distance). */
export const EFFECT_SIZE_FRACTION = 0.14;

/** Reference hand scale (wrist-to-middle-MCP distance in normalized coords) representing "normal" distance. */
export const REFERENCE_HAND_SCALE = 0.07;

/** Minimum effect size as a fraction of drawH. */
export const EFFECT_MIN_SIZE_FRACTION = 0.06;

/** Maximum effect size as a fraction of drawH. */
export const EFFECT_MAX_SIZE_FRACTION = 0.8;

/** How far above the thumb tip to place the effect, in normalized coords (at reference hand distance). */
export const EFFECT_Y_OFFSET = 0.15;

/** Minimum Y offset (far from camera). */
export const EFFECT_MIN_Y_OFFSET = 0.05;

/** Maximum Y offset (close to camera). */
export const EFFECT_MAX_Y_OFFSET = 0.2;

/** A single active effect instance. All coords are normalized 0-1. */
export type EffectInstance = {
  /** Unique ID for this instance. */
  id: number;
  /** Normalized x position (MediaPipe space, 0-1). Fixed at spawn. */
  x: number;
  /** Normalized y position (MediaPipe space, 0-1). Fixed at spawn, offset above thumb. */
  y: number;
  /** Size as a fraction of drawH, frozen at spawn based on hand distance. */
  sizeFraction: number;
  /** Timestamp (ms) when this effect was spawned. */
  spawnTime: number;
  /** Current lifecycle phase. */
  phase: EffectLifecyclePhase;
  /** Current opacity 0-1, derived from lifecycle phase and elapsed time. */
  opacity: number;
};
