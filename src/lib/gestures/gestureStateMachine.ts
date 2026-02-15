import type {
  GestureState,
  GestureTickResult,
  ThumbsUpDetection,
} from "../../types/gestures/types";
import { GESTURE_TIMING } from "../../types/gestures/types";

/** Create the initial state for a hand's gesture state machine. */
export function createInitialState(hand: "Left" | "Right"): GestureState {
  return {
    phase: "IDLE",
    phaseStartedAt: 0,
    confirmedData: null,
    hand,
  };
}

/**
 * Advance the gesture state machine by one frame.
 *
 * Pure function: current state + detection + timestamp in, new state out.
 *
 * @param state - Current gesture state for one hand.
 * @param detection - Detection result for this frame, or null if not detected / no hand found.
 * @param now - Current timestamp in ms (from requestAnimationFrame).
 */
export function tickGestureState(
  state: GestureState,
  detection: ThumbsUpDetection | null,
  now: number,
): GestureTickResult {
  const elapsed = now - state.phaseStartedAt;

  switch (state.phase) {
    case "IDLE":
      if (detection) {
        return {
          state: { ...state, phase: "CANDIDATE", phaseStartedAt: now },
          event: null,
        };
      }
      return { state, event: null };

    case "CANDIDATE":
      if (!detection) {
        return {
          state: {
            ...state,
            phase: "IDLE",
            phaseStartedAt: now,
            confirmedData: null,
          },
          event: null,
        };
      }
      if (elapsed >= GESTURE_TIMING.CANDIDATE_DURATION_MS) {
        return {
          state: {
            ...state,
            phase: "CONFIRMED",
            phaseStartedAt: now,
            confirmedData: detection,
          },
          event: "confirmed",
        };
      }
      return { state, event: null };

    case "CONFIRMED":
      // Flash state: immediately transition to COOLDOWN
      return {
        state: { ...state, phase: "COOLDOWN", phaseStartedAt: now },
        event: null,
      };

    case "COOLDOWN":
      if (elapsed >= GESTURE_TIMING.COOLDOWN_DURATION_MS) {
        return {
          state: {
            ...state,
            phase: "IDLE",
            phaseStartedAt: now,
            confirmedData: null,
          },
          event: null,
        };
      }
      return { state, event: null };
  }
}
