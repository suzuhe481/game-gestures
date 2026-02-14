import { useEffect, useRef, useState, type RefObject } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";

type HandTrackingStatus = "idle" | "loading" | "ready" | "error";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

/**
 * Initialize MediaPipe HandLandmarker and run a detection loop.
 * The detection loop will generate a new result each frame if the video
 * is playing and the HandLandmarker is initialized.
 *
 * @param videoRef - A React ref to a HTMLVideoElement.
 * @param active - Whether the HandLandmarker should be initialized.
 * @returns An object containing a React ref to the HandLandmarker result
 * and the current status of the HandLandmarker ("idle", "loading", "ready", or "error").
 */
export function useHandTracking(
  videoRef: RefObject<HTMLVideoElement | null>,
  active: boolean,
): {
  resultsRef: RefObject<HandLandmarkerResult | null>;
  status: HandTrackingStatus;
} {
  const [status, setStatus] = useState<HandTrackingStatus>("idle");
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const resultsRef = useRef<HandLandmarkerResult | null>(null);
  const lastVideoTimeRef = useRef(-1);

  // Initialize HandLandmarker once on mount
  useEffect(() => {
    let cancelled = false;

    /**
     * Initializes the HandLandmarker model.
     *
     * Sets the status to "loading", loads the model, and sets the status to "ready" if
     * successful. If an error occurs, sets the status to "error". If the initialization
     * is cancelled, does not set the status to "error".
     */
    async function init() {
      setStatus("loading");
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        if (cancelled) return;

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL },
          numHands: 2,
          runningMode: "VIDEO",
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        handLandmarkerRef.current = landmarker;
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      handLandmarkerRef.current?.close();
      handLandmarkerRef.current = null;
    };
  }, []);

  // Detection loop
  useAnimationFrame(
    (time) => {
      const video = videoRef.current;
      const landmarker = handLandmarkerRef.current;
      if (!video || !landmarker || video.readyState < 2) return;

      if (video.currentTime === lastVideoTimeRef.current) return;
      lastVideoTimeRef.current = video.currentTime;

      resultsRef.current = landmarker.detectForVideo(video, time);
    },
    active && status === "ready",
  );

  return { resultsRef, status };
}
