import type { NormalizedLandmark, Landmark } from "@mediapipe/tasks-vision";
import {
  distance2D,
  clamp,
  radToDeg,
  normalizeAngle,
  degToRad,
} from "@/lib/math/math";
import { HAND_LANDMARKS, CURL_FINGERS } from "@/types/gestures/landmarks";
import type { ThumbsUpDetection } from "../../types/gestures/types";

// --- Tunable thresholds ---

/** Thumb tip must be this much farther from wrist than thumb MCP. */
const THUMB_EXTENSION_RATIO = 1.3;

/** Finger tip-to-MCP distance must be <= this multiple of pip-to-MCP distance to count as curled. */
const FINGER_CURL_RATIO = 1.2;

/** Max angle (degrees) between thumb direction and straight-up for valid orientation. */
export const MAX_DETECTION_ANGLE_DEG = 75;

/** Max angle (radians) derived from MAX_DETECTION_ANGLE_DEG. */
const MAX_THUMB_ANGLE_FROM_UP = degToRad(MAX_DETECTION_ANGLE_DEG);

/** Minimum confidence score required to report detected = true. */
const MIN_CONFIDENCE = 0.55;

/**
 * Detect whether a single hand is showing a thumbs-up gesture.
 *
 * Pure function: landmarks in, detection result out. No side effects.
 *
 * @param landmarks - Normalized 2D landmarks (21 points, x/y in 0-1 range).
 * @param worldLandmarks - 3D world landmarks in meters (used for angle calculation).
 */
export function detectThumbsUp(
  landmarks: NormalizedLandmark[],
  worldLandmarks: Landmark[],
): ThumbsUpDetection {
  // Shared landmarks used in both early-return and successful paths
  const wrist = landmarks[HAND_LANDMARKS.WRIST];
  const middleMcp = landmarks[HAND_LANDMARKS.MIDDLE_FINGER_MCP];
  const handScale = distance2D(wrist, middleMcp);

  const noDetection: ThumbsUpDetection = {
    detected: false,
    confidence: 0,
    thumbTipPosition: {
      x: landmarks[HAND_LANDMARKS.THUMB_TIP].x,
      y: landmarks[HAND_LANDMARKS.THUMB_TIP].y,
    },
    angleDegrees: 0,
    thumbAngleFromVerticalDeg: 0,
    handScale,
  };

  // --- Condition A: Thumb is extended ---
  const thumbMcp = landmarks[HAND_LANDMARKS.THUMB_MCP];
  const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];

  const thumbTipDist = distance2D(thumbTip, wrist);
  const thumbMcpDist = distance2D(thumbMcp, wrist);

  if (thumbMcpDist === 0) return noDetection;

  const extensionRatio = thumbTipDist / thumbMcpDist;
  if (extensionRatio < THUMB_EXTENSION_RATIO) return noDetection;

  // Thumb direction vector (MCP → TIP)
  const thumbDirX = thumbTip.x - thumbMcp.x;
  const thumbDirY = thumbTip.y - thumbMcp.y;

  // Thumb must point upward (negative y in image coords)
  if (thumbDirY >= 0) return noDetection;

  // --- Condition B: Four fingers are curled ---
  let curledCount = 0;
  let curlTightness = 0; // accumulate how tightly curled

  for (const finger of CURL_FINGERS) {
    const tip = landmarks[finger.tip];
    const pip = landmarks[finger.pip];
    const mcp = landmarks[finger.mcp];

    const tipToMcp = distance2D(tip, mcp);
    const pipToMcp = distance2D(pip, mcp);

    if (pipToMcp === 0) continue;

    const ratio = tipToMcp / pipToMcp;
    if (ratio <= FINGER_CURL_RATIO) {
      curledCount++;
      // How far below the threshold: lower ratio = tighter curl = higher score
      curlTightness += clamp(1 - ratio / FINGER_CURL_RATIO, 0, 1);
    }
  }

  if (curledCount < 4) return noDetection;

  // --- Condition C: Valid orientation (thumb within ~60deg of straight up) ---
  const thumbDirLen = Math.sqrt(thumbDirX * thumbDirX + thumbDirY * thumbDirY);
  if (thumbDirLen === 0) return noDetection;

  // Angle between thumb direction and straight-up (0, -1)
  // cos(angle) = dot(thumbDir, up) / |thumbDir|
  // dot = thumbDirX * 0 + thumbDirY * (-1) = -thumbDirY
  const cosAngle = -thumbDirY / thumbDirLen;
  const angleFromUp = Math.acos(clamp(cosAngle, -1, 1));

  if (angleFromUp > MAX_THUMB_ANGLE_FROM_UP) return noDetection;

  // --- Confidence score ---
  // Sub-score A: how far beyond the extension threshold (0-1)
  const extensionScore = clamp(
    (extensionRatio - THUMB_EXTENSION_RATIO) / 0.5,
    0,
    1,
  );

  // Sub-score B: average curl tightness across 4 fingers (0-1)
  const curlScore = curlTightness / 4;

  // Sub-score C: how vertical the thumb is (0-1, 1 = perfectly vertical)
  const orientationScore = clamp(
    1 - angleFromUp / MAX_THUMB_ANGLE_FROM_UP,
    0,
    1,
  );

  const confidence =
    extensionScore * 0.3 + curlScore * 0.4 + orientationScore * 0.3;

  if (confidence < MIN_CONFIDENCE) return noDetection;

  // --- Angle calculation (palm rotation, 0-360 degrees) ---
  const angleDegrees = computePalmAngle(worldLandmarks);

  // --- Signed angle from vertical (for tilt direction) ---
  // atan2(thumbDirX, -thumbDirY): positive = leaning right, negative = leaning left
  const signedAngleFromUp = Math.atan2(thumbDirX, -thumbDirY);

  return {
    detected: true,
    confidence,
    thumbTipPosition: { x: thumbTip.x, y: thumbTip.y },
    angleDegrees,
    thumbAngleFromVerticalDeg: radToDeg(signedAngleFromUp),
    handScale,
  };
}

/**
 * Compute the palm's rotation angle around the vertical axis using world landmarks.
 *
 * Uses the cross product of two vectors in the palm plane to get the palm normal,
 * then projects it onto the xz-plane to get the azimuthal angle.
 *
 * @returns Angle in degrees (0 = palm facing camera, 90 = sideways), normalized 0-360.
 */
function computePalmAngle(worldLandmarks: Landmark[]): number {
  const wrist = worldLandmarks[HAND_LANDMARKS.WRIST];
  const indexMcp = worldLandmarks[HAND_LANDMARKS.INDEX_FINGER_MCP];
  const pinkyMcp = worldLandmarks[HAND_LANDMARKS.PINKY_MCP];

  // Vector A: wrist → index MCP
  const ax = indexMcp.x - wrist.x;
  const ay = indexMcp.y - wrist.y;
  const az = indexMcp.z - wrist.z;

  // Vector B: wrist → pinky MCP
  const bx = pinkyMcp.x - wrist.x;
  const by = pinkyMcp.y - wrist.y;
  const bz = pinkyMcp.z - wrist.z;

  // Cross product A × B = palm normal
  const nx = ay * bz - az * by;
  // ny = az * bx - ax * bz; // not needed for xz projection
  const nz = ax * by - ay * bx;

  // Angle of the normal projected onto the xz-plane
  // atan2(nx, -nz): 0 = facing camera (-z direction), 90 = facing right (+x)
  const angleRad = Math.atan2(nx, -nz);

  return normalizeAngle(radToDeg(angleRad));
}
