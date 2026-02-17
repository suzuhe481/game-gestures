import type { EffectInstance } from "@/types/effects/types";
import { drawDiamondPath, drawCaretPath, drawHeartPath } from "./heartShapes";

// ---------------------------------------------------------------------------
// ─── TUNABLE TIMING & SIZE CONFIG ───
//
// All phase boundaries are in "progress" units (0–1 over TOTAL_MS).
// To shift where phases start/end, change PHASE_BOUNDARIES.
// Sub-timelines within each phase use "phaseProgress" (0–1 within that phase).
// ---------------------------------------------------------------------------

/** Total animation duration (ms). Keep in sync with HOLD_MS in types.ts. */
const TOTAL_MS = 1500;

/**
 * Progress values at which each phase transitions to the next.
 * Phase 1 (diamond) runs from 0 to diamondEnd.
 * Phase 2 (caret)   runs from diamondEnd to caretEnd.
 * Phase 3 (heart)   runs from caretEnd to 1.0.
 */
const PHASE_BOUNDARIES = {
  /** Progress at which Phase 1 (diamond) ends and Phase 2 (caret) begins. (200ms / 1500ms) */
  diamondEnd: 0.133,
  /** Progress at which Phase 2 (caret) ends and Phase 3 (heart) begins. (400ms / 1500ms) */
  caretEnd: 0.267,
} as const;

/** Phase 1 – Diamond shape dimensions (as multipliers of `size`). */
const DIAMOND_CONFIG = {
  /** Horizontal extent of the diamond. */
  width: 0.6,
  /** Vertical extent of the diamond (small = flatter). */
  height: 0.2,
} as const;

/** Phase 2 – Caret shape dimensions and drift. */
const CARET_CONFIG = {
  /** Horizontal extent of the caret. */
  width: 0.6,
  /** Vertical extent of the caret (tip height). */
  height: 0.3,
  /** How far the caret drifts upward (fraction of size). Decrease for less drift. */
  driftDistance: 0.15,
} as const;

/** Phase 3 – Heart dimensions and pulse. */
const HEART_CONFIG = {
  /** Heart size relative to effect size. */
  sizeMultiplier: 0.5,
  /** Max scale during pulse (1.0 = no change, 1.3 = 30% larger). */
  pulseMaxScale: 1.3,
} as const;

// ---------------------------------------------------------------------------
// ─── COLOR CONFIG ───
// ---------------------------------------------------------------------------

/** HSL values matching --gg-accent: hsl(200, 100%, 60%) */
const ACCENT_H = 200;
const ACCENT_S = 100;
const ACCENT_L = 60;
const GLOW_L = 70;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function smoothstep(value: number): number {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function applyGlow(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.shadowColor = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${GLOW_L}%, 0.6)`;
  ctx.shadowBlur = size * 0.4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// ---------------------------------------------------------------------------
// Phase 1 – Flashing Diamond Line
// ---------------------------------------------------------------------------

/**
 * Diamond opacity sub-timeline (phaseProgress 0 → 1):
 *
 *   0.00──0.20  Flash 1 ON   (fade in)
 *   0.20──0.35  Flash 1 OFF  (fade out)
 *   0.35──0.55  Flash 2 ON   (fade in)
 *   0.55──0.75  Flash 2 OFF  (fade out)
 *   0.75──1.00  Gap          (invisible)
 *
 * To make flashes faster/slower, shrink/expand the ranges.
 * To add a third flash, extend the pattern before the gap.
 */
function computeDiamondOpacity(phaseProgress: number): number {
  if (phaseProgress < 0.2) return smoothstep(phaseProgress / 0.2);
  if (phaseProgress < 0.35) return 1 - smoothstep((phaseProgress - 0.2) / 0.15);
  if (phaseProgress < 0.55) return smoothstep((phaseProgress - 0.35) / 0.2);
  if (phaseProgress < 0.75) return 1 - smoothstep((phaseProgress - 0.55) / 0.2);
  return 0;
}

function drawPhase1_Diamond(
  ctx: CanvasRenderingContext2D,
  phaseProgress: number,
  size: number,
): void {
  const opacity = computeDiamondOpacity(phaseProgress);
  if (opacity <= 0) return;

  const diamondWidth = DIAMOND_CONFIG.width * size;
  const diamondHeight = DIAMOND_CONFIG.height * size;

  ctx.globalAlpha = opacity;
  applyGlow(ctx, size);

  ctx.fillStyle = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${ACCENT_L}%, 0.8)`;
  drawDiamondPath(ctx, diamondWidth, diamondHeight);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${GLOW_L}%, 0.9)`;
  ctx.lineWidth = Math.max(1, size * 0.02);
  drawDiamondPath(ctx, diamondWidth, diamondHeight);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Phase 2 – Caret drifts upward
// ---------------------------------------------------------------------------

/**
 * Caret opacity sub-timeline (phaseProgress 0 → 1):
 *
 *   0.00──0.15  Appear       (fade in to 1.0)
 *   0.15──0.45  Slow fade    (1.0 → 0.2)
 *   0.45──0.60  Reappear     (0.2 → 1.0)
 *   0.60──1.00  Final fade   (1.0 → 0.0)
 *
 * The caret drifts upward throughout by CARET_CONFIG.driftDistance * size.
 */
function computeCaretOpacity(phaseProgress: number): number {
  if (phaseProgress < 0.15) return smoothstep(phaseProgress / 0.15);
  if (phaseProgress < 0.45) return 1.0 - ((phaseProgress - 0.15) / 0.3) * 0.8;
  if (phaseProgress < 0.6) return 0.2 + ((phaseProgress - 0.45) / 0.15) * 0.8;
  return 1.0 - (phaseProgress - 0.6) / 0.4;
}

function drawPhase2_Caret(
  ctx: CanvasRenderingContext2D,
  phaseProgress: number,
  size: number,
): void {
  const opacity = computeCaretOpacity(phaseProgress);
  if (opacity <= 0) return;

  const verticalDrift = -phaseProgress * size * CARET_CONFIG.driftDistance;
  const caretWidth = CARET_CONFIG.width * size;
  const caretHeight = CARET_CONFIG.height * size;

  ctx.save();
  ctx.translate(0, verticalDrift);
  ctx.globalAlpha = opacity;
  applyGlow(ctx, size);

  ctx.fillStyle = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${ACCENT_L}%, 0.8)`;
  drawCaretPath(ctx, caretWidth, caretHeight);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${GLOW_L}%, 0.9)`;
  ctx.lineWidth = Math.max(1, size * 0.02);
  drawCaretPath(ctx, caretWidth, caretHeight);
  ctx.stroke();

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Phase 3 – Heart sequence
// ---------------------------------------------------------------------------

type HeartState = {
  opacity: number;
  fillOpacity: number;
  scale: number;
};

/**
 * Heart state sub-timeline (phaseProgress 0 → 1):
 *
 *   0.00──0.08  Appear filled        (opacity 0 → 1)
 *   0.08──0.16  Flash 1 OFF          (opacity 1 → 0)
 *   0.16──0.24  Flash 1 ON           (opacity 0 → 1)
 *   0.24──0.32  Flash 2 OFF          (opacity 1 → 0)
 *   0.32──0.40  Reappear filled      (opacity 0 → 1)
 *   0.40──0.50  Hollow transition    (fillOpacity 1 → 0, stroke stays)
 *   0.50──0.57  Hollow hold          (stroke only)
 *   0.57──0.65  Fill back in         (fillOpacity 0 → 1)
 *   0.65──0.80  Pulse                (scale 1.0 → 1.3 → 1.0)
 *   0.80──0.87  Final flash 1        (peak opacity 1.0)
 *   0.87──0.93  Final flash 2        (peak opacity 0.7)
 *   0.93──1.00  Final flash 3 + fade (opacity → 0)
 */
function computeHeartState(phaseProgress: number): HeartState {
  let opacity = 1;
  let fillOpacity = 1;
  let scale = 1;

  if (phaseProgress < 0.08) {
    // Filled heart appears
    opacity = smoothstep(phaseProgress / 0.08);
  } else if (phaseProgress < 0.16) {
    // Flash 1 OFF
    opacity = 1 - smoothstep((phaseProgress - 0.08) / 0.08);
  } else if (phaseProgress < 0.24) {
    // Flash 1 ON
    opacity = smoothstep((phaseProgress - 0.16) / 0.08);
  } else if (phaseProgress < 0.32) {
    // Flash 2 OFF
    opacity = 1 - smoothstep((phaseProgress - 0.24) / 0.08);
  } else if (phaseProgress < 0.4) {
    // Reappear filled
    opacity = smoothstep((phaseProgress - 0.32) / 0.08);
  } else if (phaseProgress < 0.5) {
    // Transition to hollow (fill fades, stroke stays)
    fillOpacity = 1 - smoothstep((phaseProgress - 0.4) / 0.1);
  } else if (phaseProgress < 0.57) {
    // Hollow hold
    fillOpacity = 0;
  } else if (phaseProgress < 0.65) {
    // Fill back in
    fillOpacity = smoothstep((phaseProgress - 0.57) / 0.08);
  } else if (phaseProgress < 0.8) {
    // Pulse: scale 1.0 → max → 1.0
    const subProgress = (phaseProgress - 0.65) / 0.15;
    const eased =
      subProgress < 0.5
        ? smoothstep(subProgress * 2)
        : smoothstep((1 - subProgress) * 2);
    scale = 1 + (HEART_CONFIG.pulseMaxScale - 1) * eased;
  } else if (phaseProgress < 0.87) {
    // Final flash 1 (peak 1.0)
    const subProgress = (phaseProgress - 0.8) / 0.07;
    opacity =
      subProgress < 0.5
        ? 1 - smoothstep(subProgress * 2)
        : smoothstep((subProgress - 0.5) * 2);
  } else if (phaseProgress < 0.93) {
    // Final flash 2 (peak 0.7)
    const subProgress = (phaseProgress - 0.87) / 0.06;
    opacity =
      subProgress < 0.5
        ? 0.7 * (1 - smoothstep(subProgress * 2))
        : 0.7 * smoothstep((subProgress - 0.5) * 2);
  } else {
    // Final flash 3 + fade to 0
    const subProgress = (phaseProgress - 0.93) / 0.07;
    opacity = 0.4 * (1 - smoothstep(subProgress));
  }

  return { opacity, fillOpacity, scale };
}

function drawPhase3_Heart(
  ctx: CanvasRenderingContext2D,
  phaseProgress: number,
  size: number,
): void {
  const { opacity, fillOpacity, scale } = computeHeartState(phaseProgress);
  if (opacity <= 0) return;

  const heartSize = HEART_CONFIG.sizeMultiplier * size;

  ctx.save();
  if (scale !== 1) ctx.scale(scale, scale);

  applyGlow(ctx, size);

  // Fill (when visible)
  if (fillOpacity > 0) {
    ctx.globalAlpha = opacity * fillOpacity;
    ctx.fillStyle = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${ACCENT_L}%, 0.7)`;
    drawHeartPath(ctx, heartSize);
    ctx.fill();
  }

  // Stroke (always drawn when heart is visible)
  ctx.shadowBlur = 0;
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = `hsla(${ACCENT_H}, ${ACCENT_S}%, ${GLOW_L}%, 0.9)`;
  ctx.lineWidth = Math.max(1, size * 0.03);
  drawHeartPath(ctx, heartSize);
  ctx.stroke();

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Draw the cinematic heart effect animation on a Canvas 2D context.
 *
 * The animation has three phases controlled by PHASE_BOUNDARIES:
 *   1. Flashing diamond line   (progress 0 – diamondEnd)
 *   2. Caret drifts upward     (progress diamondEnd – caretEnd)
 *   3. Heart sequence          (progress caretEnd – 1.0)
 *
 * @param ctx - The 2D rendering context (identity transform).
 * @param instance - The effect instance to draw.
 * @param drawW - Full draw-space width (video scaled to fill container).
 * @param drawH - Full draw-space height (video scaled to fill container).
 * @param offsetX - Horizontal crop offset for object-cover alignment.
 * @param offsetY - Vertical crop offset for object-cover alignment.
 * @param time - Current timestamp from requestAnimationFrame.
 */
export function drawHeartEffect(
  ctx: CanvasRenderingContext2D,
  instance: EffectInstance,
  drawW: number,
  drawH: number,
  offsetX: number,
  offsetY: number,
  time: number,
): void {
  const elapsed = time - instance.spawnTime;
  if (elapsed < 0 || elapsed > TOTAL_MS) return;

  const progress = elapsed / TOTAL_MS;

  const centerX = instance.x * drawW - offsetX;
  const centerY = instance.y * drawH - offsetY;
  const size = instance.sizeFraction * drawH;

  ctx.save();
  ctx.translate(centerX, centerY);

  const { diamondEnd, caretEnd } = PHASE_BOUNDARIES;

  if (progress < diamondEnd) {
    const phaseProgress = progress / diamondEnd;
    drawPhase1_Diamond(ctx, phaseProgress, size);
  } else if (progress < caretEnd) {
    const phaseProgress = (progress - diamondEnd) / (caretEnd - diamondEnd);
    drawPhase2_Caret(ctx, phaseProgress, size);
  } else {
    const phaseProgress = (progress - caretEnd) / (1 - caretEnd);
    drawPhase3_Heart(ctx, phaseProgress, size);
  }

  ctx.restore();
}
