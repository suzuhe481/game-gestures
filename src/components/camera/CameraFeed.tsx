import { useRef } from "react";
import { Camera, LoaderCircle } from "lucide-react";
import { useOrientation } from "@/hooks/useOrientation";
import { useCamera } from "@/hooks/useCamera";
import { useHandTracking } from "@/hooks/useHandTracking";
import { useGestureDetection } from "@/hooks/useGestureDetection";
import { useEffectManager } from "@/hooks/useEffectManager";
import { useAudio } from "@/hooks/useAudio";
import { useCameraStore } from "@/store/camera-store";
import {
  initAudioContext,
  resumeAudioContext,
} from "@/lib/audio/audioEngine";
import { cn } from "@/lib/utils";
import DebugOverlay from "@/components/DebugOverlay/DebugOverlay";
import EffectsOverlay from "@/components/EffectsOverlay/EffectsOverlay";
import GestureDebugPanel from "@/components/GestureDebugPanel/GestureDebugPanel";

/**
 * CameraFeed component.
 *
 * This component renders a camera feed from the user's device camera,
 * along with a debug overlay showing the hand tracking results.
 *
 * It also renders a placeholder with an enable camera button when the
 * camera is not enabled, and a loading state when the camera is
 * initializing.
 *
 * If the camera initialization fails, it renders an error state.
 *
 * The component uses the useCamera, useHandTracking, and useOrientation
 * hooks to manage the camera feed, hand tracking, and device orientation.
 */
function CameraFeed() {
  const orientation = useOrientation();
  const isPortrait = orientation === "portrait";

  const isCameraEnabled = useCameraStore((s) => s.isCameraEnabled);
  const isDebugEnabled = useCameraStore((s) => s.isDebugEnabled);
  const isMirrored = useCameraStore((s) => s.isMirrored);
  const enableCamera = useCameraStore((s) => s.enableCamera);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { status: cameraStatus, error } = useCamera(videoRef, isCameraEnabled);
  const { resultsRef } = useHandTracking(videoRef, cameraStatus === "active");
  const gestureRef = useGestureDetection(resultsRef, cameraStatus === "active");
  const effectInstancesRef = useEffectManager(
    gestureRef,
    cameraStatus === "active",
  );
  useAudio(gestureRef, cameraStatus === "active");

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-4",
        isPortrait ? "max-w-sm" : "max-w-3xl",
      )}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg border border-gg-border bg-gg-bg-surface aspect-video"
        style={isPortrait ? { aspectRatio: "9/16" } : undefined}
      >
        {/* Video element */}
        {isCameraEnabled && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: isMirrored ? "scaleX(-1)" : undefined }}
          />
        )}

        {/* Debug overlay */}
        {isCameraEnabled && cameraStatus === "active" && isDebugEnabled && (
          <DebugOverlay
            videoRef={videoRef}
            resultsRef={resultsRef}
            active={isDebugEnabled}
          />
        )}

        {/* Effects overlay */}
        {isCameraEnabled && cameraStatus === "active" && (
          <EffectsOverlay
            videoRef={videoRef}
            effectInstancesRef={effectInstancesRef}
            active={cameraStatus === "active"}
          />
        )}

        {/* Placeholder + Enable Camera button */}
        {!isCameraEnabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gg-text-secondary">
            <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-gg-border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-8 text-gg-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <p className="text-sm">Camera feed will appear here</p>
            <button
              onClick={() => {
                enableCamera();
                initAudioContext();
                resumeAudioContext();
              }}
              className="flex items-center gap-2 rounded-md border border-gg-accent/30 bg-gg-accent/10 px-4 py-2 text-sm text-gg-accent transition-colors hover:bg-gg-accent/20"
            >
              <Camera className="size-4" />
              Enable Camera
            </button>
          </div>
        )}

        {/* Loading state */}
        {isCameraEnabled && cameraStatus === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoaderCircle className="size-8 animate-spin text-gg-accent" />
          </div>
        )}

        {/* Error state */}
        {isCameraEnabled && cameraStatus === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gg-text-secondary">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Gesture debug panel below the camera feed */}
      {isCameraEnabled && cameraStatus === "active" && isDebugEnabled && (
        <GestureDebugPanel gestureRef={gestureRef} active={isDebugEnabled} />
      )}
    </div>
  );
}

export default CameraFeed;
