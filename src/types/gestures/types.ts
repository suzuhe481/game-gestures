/** Result of a single-frame thumbs-up detection for one hand. */
export type ThumbsUpDetection = {
  detected: boolean;
  confidence: number;
  thumbTipPosition: { x: number; y: number };
  /** Palm rotation angle in degrees (0 = front, 90 = side), normalized 0-360. */
  angleDegrees: number;
  /** Signed angle of thumb from vertical in degrees. Positive = leaning right, negative = left. */
  thumbAngleFromVerticalDeg: number;
  /** Apparent hand size in normalized coords (wrist-to-middle-MCP distance). Larger = closer to camera. */
  handScale: number;
};

/** Gesture state machine phase. */
export type GesturePhase =
  | "IDLE"
  | "CANDIDATE"
  | "CONFIRMED"
  | "COOLDOWN"
  | "HELD";

/** Per-hand gesture state tracked across frames. */
export type GestureState = {
  phase: GesturePhase;
  phaseStartedAt: number;
  confirmedData: ThumbsUpDetection | null;
  hand: "Left" | "Right";
};

/** Result returned by the state machine tick function. */
export type GestureTickResult = {
  state: GestureState;
  /** Non-null only on the single frame when CONFIRMED is entered. */
  event: "confirmed" | null;
};

/** Aggregate gesture info for both hands, written to a ref each frame. */
export type GestureSnapshot = {
  left: {
    state: GestureState;
    detection: ThumbsUpDetection | null;
    event: "confirmed" | null;
  };
  right: {
    state: GestureState;
    detection: ThumbsUpDetection | null;
    event: "confirmed" | null;
  };
  timestamp: number;
};

/** Timing constants for the gesture state machine. */
export const GESTURE_TIMING = {
  /** How long a gesture must be held before confirming (ms). */
  CANDIDATE_DURATION_MS: 100,
  /** Cooldown period after confirmation before re-triggering (ms). */
  COOLDOWN_DURATION_MS: 1000,
} as const;
