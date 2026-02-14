import { useEffect, useState, type RefObject } from "react";

type CameraStatus = "idle" | "loading" | "active" | "error";

type UseCameraResult = {
  status: CameraStatus;
  error: string | null;
};

/**
 * Initializes a camera stream on a HTMLVideoElement.
 *
 * @param videoRef - A React ref to a HTMLVideoElement.
 * @param enabled - Whether the camera stream should be initialized.
 * @returns An object containing the current status of the camera stream
 * ("idle", "loading", "active", or "error") and any error message.
 */
export function useCamera(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
): UseCameraResult {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let stream: MediaStream | null = null;

    /**
     * Initializes the camera stream on a HTMLVideoElement.
     *
     * If the camera permission is denied, sets the status to "error" and the error message to
     * "Camera permission denied. Please allow camera access." If no camera is found, sets the status
     * to "error" and the error message to "No camera found on this device." If an unexpected error
     * occurs, sets the status to "error" and the error message to "Failed to access camera.".
     *
     * If the function is cancelled while awaiting the camera stream, stops the camera tracks and does not set
     * the status to "error".
     */
    async function startCamera() {
      setStatus("loading");
      setError(null);

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        video!.srcObject = stream;
        await video!.play();

        if (!cancelled) {
          setStatus("active");
        }
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof DOMException && err.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access."
            : err instanceof DOMException && err.name === "NotFoundError"
              ? "No camera found on this device."
              : "Failed to access camera.";

        setError(message);
        setStatus("error");
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (video) {
        video.srcObject = null;
      }
      setStatus("idle");
      setError(null);
    };
  }, [enabled, videoRef]);

  return { status, error };
}
