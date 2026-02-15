import type { EffectInstance } from "@/types/effects/types";

/** HSL values matching --gg-accent: hsl(200, 100%, 60%) */
const ACCENT_H = 200;
const ACCENT_S = 100;
const ACCENT_L = 60;
const GLOW_L = 70;

/**
 * Draw a single thumbs up effect on a Canvas 2D context.
 *
 * The context should already have the object-cover transform applied.
 * Coordinates are in draw-space where normalized 0-1 maps to drawW x drawH.
 *
 * @param ctx - The 2D rendering context (with object-cover transform active).
 * @param instance - The effect instance to draw.
 * @param drawW - Full draw-space width (for scaling normalized x).
 * @param drawH - Full draw-space height (for scaling normalized y and size).
 */
export function drawHeartEffect(
  ctx: CanvasRenderingContext2D,
  instance: EffectInstance,
  drawW: number,
  drawH: number,
): void {
  if (instance.opacity <= 0) return;

  // Convert normalized coords to draw-space pixels
  const cx = instance.x * drawW;
  const cy = instance.y * drawH;

  // Effect size proportional to height, scaled by hand distance at spawn
  const size = instance.sizeFraction * drawH;
  const half = size / 2;

  ctx.save();

  // Position at effect center
  ctx.translate(cx, cy);

  // Lifecycle fade
  ctx.globalAlpha = instance.opacity;

  // Outer glow
  ctx.shadowColor = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${GLOW_L}%, 0.6)`;
  ctx.shadowBlur = size * 0.4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Fill
  ctx.fillStyle = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${ACCENT_L}%, 0.7)`;
  ctx.fillRect(-half, -half, size, size);

  // Border (no shadow to avoid double glow)
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${GLOW_L}%, 0.9)`;
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.strokeRect(-half, -half, size, size);

  ctx.restore();
}
