import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

/** Euclidean distance between two normalized landmarks in 2D (x, y). */
export function distance2D(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Convert radians to degrees. */
export function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

/** Normalize an angle to the 0-360 range. */
export function normalizeAngle(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}
