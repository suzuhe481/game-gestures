import { useRef, type RefObject } from "react";
import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { detectThumbsUp } from "../lib/gestures/detectThumbsUp";
import {
  tickGestureState,
  createInitialState,
} from "../lib/gestures/gestureStateMachine";
import type {
  GestureSnapshot,
  GestureState,
  ThumbsUpDetection,
} from "../types/gestures/types";

/**
 * Run gesture detection and state machines each frame.
 *
 * Consumes the `resultsRef` from `useHandTracking` and returns a ref
 * containing the current gesture snapshot for both hands.
 * Uses refs to avoid React re-renders in the hot loop.
 *
 * @param resultsRef - Ref to the latest HandLandmarkerResult from useHandTracking.
 * @param active - Whether the detection loop should run.
 * @returns Ref to the current GestureSnapshot, updated every frame.
 */
export function useGestureDetection(
  resultsRef: RefObject<HandLandmarkerResult | null>,
  active: boolean,
): RefObject<GestureSnapshot | null> {
  const snapshotRef = useRef<GestureSnapshot | null>(null);
  const leftStateRef = useRef<GestureState>(createInitialState("Left"));
  const rightStateRef = useRef<GestureState>(createInitialState("Right"));

  useAnimationFrame((time) => {
    const results = resultsRef.current;

    // Detect thumbs-up for each hand present in the results
    let leftDetection: ThumbsUpDetection | null = null;
    let rightDetection: ThumbsUpDetection | null = null;

    if (results?.landmarks) {
      for (let i = 0; i < results.landmarks.length; i++) {
        const landmarks = results.landmarks[i];
        const worldLandmarks = results.worldLandmarks[i];
        const handedness = results.handedness[i];

        const label = handedness?.[0]?.categoryName;
        const detection = detectThumbsUp(landmarks, worldLandmarks);

        if (label === "Left") {
          leftDetection = detection;
        } else if (label === "Right") {
          rightDetection = detection;
        }
      }
    }

    // Tick both state machines (even when no hand detected, so timers expire)
    const leftTick = tickGestureState(
      leftStateRef.current,
      leftDetection?.detected ? leftDetection : null,
      time,
    );
    const rightTick = tickGestureState(
      rightStateRef.current,
      rightDetection?.detected ? rightDetection : null,
      time,
    );

    leftStateRef.current = leftTick.state;
    rightStateRef.current = rightTick.state;

    snapshotRef.current = {
      left: {
        state: leftTick.state,
        detection: leftDetection,
        event: leftTick.event,
      },
      right: {
        state: rightTick.state,
        detection: rightDetection,
        event: rightTick.event,
      },
      timestamp: time,
    };
  }, active);

  return snapshotRef;
}
