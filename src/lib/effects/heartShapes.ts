/**
 * Pure Canvas path helpers for the heart effect animation.
 * Each function builds a path centered at the current origin.
 * The caller is responsible for calling fill() / stroke() afterward.
 */

/** Flat diamond (rhombus) with pointed ends. */
export function drawDiamondPath(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const adjustedWidth = width / 2;
  const adjustedHeight = height / 8;

  ctx.beginPath();
  ctx.moveTo(-adjustedWidth, 0);
  ctx.lineTo(0, -adjustedHeight);
  ctx.lineTo(adjustedWidth, 0);
  ctx.lineTo(0, adjustedHeight);
  ctx.closePath();
}

/** Caret (^) shape — an upward-pointing chevron. */
export function drawCaretPath(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const adjustedWidth = width / 2;
  const adjustedHeight = height / 8;

  ctx.beginPath();
  ctx.moveTo(-adjustedWidth, 0);
  ctx.lineTo(0, -adjustedHeight);
  ctx.lineTo(adjustedWidth, 0);
  ctx.lineTo(0, -adjustedHeight - (adjustedHeight - 2));
  ctx.closePath();
}

/** Heart shape using cubic bezier curves. */
export function drawHeartPath(
  ctx: CanvasRenderingContext2D,
  size: number,
): void {
  const topY = -size * 0.35;
  const bottomY = size * 0.6;
  const halfW = size * 0.5;
  const topDip = -size * 0.15;

  ctx.beginPath();
  // Start at bottom tip
  ctx.moveTo(0, bottomY);

  // Left lobe: bottom tip → top center dip
  ctx.bezierCurveTo(
    -halfW * 0.5,
    bottomY * 0.3, // cp1: slightly left, above bottom
    -halfW * 1.3,
    topY * 0.4, // cp2: far left, mid-height
    -halfW * 0.7,
    topY, // end: left lobe peak
  );

  // Left lobe top → center dip
  ctx.bezierCurveTo(
    -halfW * 0.3,
    topY * 1.3, // cp1: inner left, above peak
    -halfW * 0.05,
    topDip * 0.8, // cp2: near center
    0,
    topDip, // end: center dip
  );

  // Right lobe: center dip → right lobe peak
  ctx.bezierCurveTo(
    halfW * 0.05,
    topDip * 0.8,
    halfW * 0.3,
    topY * 1.3,
    halfW * 0.7,
    topY,
  );

  // Right lobe peak → bottom tip
  ctx.bezierCurveTo(
    halfW * 1.3,
    topY * 0.4,
    halfW * 0.5,
    bottomY * 0.3,
    0,
    bottomY,
  );

  ctx.closePath();
}
