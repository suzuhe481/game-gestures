import { useEffect, useRef, type RefObject } from "react";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { useCameraStore } from "@/store/camera-store";
import { drawHeartEffect } from "@/lib/effects/drawHeartEffect";
import type { EffectInstance } from "@/types/effects/types";

type EffectsOverlayProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  effectInstancesRef: RefObject<EffectInstance[]>;
  active: boolean;
};

/**
 * Canvas overlay that renders active visual effects on top of the camera feed.
 *
 * Follows the same coordinate transform pattern as DebugOverlay:
 * - Canvas dimensions synced to video element via ResizeObserver
 * - Object-cover transform to align normalized coords with cropped video
 * - CSS scaleX(-1) for mirror handling
 */
function EffectsOverlay({
  videoRef,
  effectInstancesRef,
  active,
}: EffectsOverlayProps) {
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

  // Draw effects each frame
  useAnimationFrame((time) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const instances = effectInstancesRef.current;
    if (instances.length === 0 || video.videoWidth === 0) return;

    // Compute object-cover transform (same as DebugOverlay)
    const containerW = canvas.width;
    const containerH = canvas.height;
    const videoAspect = video.videoWidth / video.videoHeight;
    const containerAspect = containerW / containerH;

    let drawW: number, drawH: number, offsetX: number, offsetY: number;

    if (videoAspect > containerAspect) {
      drawH = containerH;
      drawW = containerH * videoAspect;
      offsetX = (drawW - containerW) / 2;
      offsetY = 0;
    } else {
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

    for (const instance of instances) {
      drawHeartEffect(ctx, instance, drawW, drawH, time);
    }

    ctx.restore();
  }, active);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: isMirrored ? "scaleX(-1)" : undefined,
        zIndex: 20,
      }}
    />
  );
}

export default EffectsOverlay;
