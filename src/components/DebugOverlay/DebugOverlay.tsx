import { useEffect, useRef, type RefObject } from "react";
import {
  DrawingUtils,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { useCameraStore } from "@/store/camera-store";

type DebugOverlayProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  resultsRef: RefObject<HandLandmarkerResult | null>;
  active: boolean;
};

/**
 * Debug overlay component that renders hand landmarks from MediaPipe Hands.
 * The component receives a video element ref, a hand landmarks result ref, and an active flag.
 * When active, the component draws the hand landmarks on top of the video using a canvas element.
 * The component also syncs the canvas dimensions with the video element and applies an object-cover transform to align the landmarks with the cropped video.
 * @param {RefObject<HTMLVideoElement | null>} videoRef - The video element ref to sync the canvas dimensions with.
 * @param {RefObject<HandLandmarkerResult | null>} resultsRef - The hand landmarks result ref to draw the landmarks from.
 * @param {boolean} active - The active flag to control whether the component should draw the hand landmarks or not.
 * @returns {JSX.Element} - The DebugOverlay component.
 */
function DebugOverlay({ videoRef, resultsRef, active }: DebugOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMirrored = useCameraStore((s) => s.isMirrored);

  // Sync canvas dimensions with video element
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const observer = new ResizeObserver(() => {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    });

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoRef]);

  // Draw landmarks each frame
  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const results = resultsRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results?.landmarks && video.videoWidth > 0) {
      // Compute object-cover transform to align landmarks with cropped video
      const containerW = canvas.width;
      const containerH = canvas.height;
      const videoAspect = video.videoWidth / video.videoHeight;
      const containerAspect = containerW / containerH;

      let drawW: number, drawH: number, offsetX: number, offsetY: number;

      if (videoAspect > containerAspect) {
        // Video is wider than container — horizontal cropping
        drawH = containerH;
        drawW = containerH * videoAspect;
        offsetX = (drawW - containerW) / 2;
        offsetY = 0;
      } else {
        // Video is taller than container — vertical cropping
        drawW = containerW;
        drawH = containerW / videoAspect;
        offsetX = 0;
        offsetY = (drawH - containerH) / 2;
      }

      ctx.save();
      ctx.setTransform(
        drawW / containerW,
        0,
        0,
        drawH / containerH,
        -offsetX,
        -offsetY,
      );

      const drawingUtils = new DrawingUtils(ctx);
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          HandLandmarker.HAND_CONNECTIONS,
          { color: "#39FF14", lineWidth: 5 },
        );
        drawingUtils.drawLandmarks(landmarks, {
          color: "#FF3D00",
          lineWidth: 5,
          radius: 3,
        });
      }

      ctx.restore();
    }
  }, active);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ transform: isMirrored ? "scaleX(-1)" : undefined }}
    />
  );
}

export default DebugOverlay;
