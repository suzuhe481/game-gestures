import { useState, useRef, type RefObject } from "react";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import type { GestureSnapshot, GesturePhase } from "@/types/gestures/types";
import { useCameraStore } from "@/store/camera-store";

type GestureDebugPanelProps = {
  gestureRef: RefObject<GestureSnapshot | null>;
  active: boolean;
};

const PHASE_COLORS: Record<GesturePhase, string> = {
  IDLE: "text-gg-text-secondary",
  CANDIDATE: "text-amber-400",
  CONFIRMED: "text-emerald-400",
  COOLDOWN: "text-blue-400",
  HELD: "text-orange-400",
};

/**
 * Gesture debug panel component.
 *
 * This component renders a debug panel showing the gesture state of each hand.
 * The panel is updated in real-time using the `useAnimationFrame` hook.
 * The component also mirrors the hand data if the camera is mirrored.
 *
 * @param {GestureDebugPanelProps} props - The component props.
 * @param {RefObject<GestureSnapshot | null>} props.gestureRef - A ref to the gesture snapshot object.
 * @param {boolean} props.active - A flag indicating whether the gesture debug panel is active or not.
 */
function GestureDebugPanel({ gestureRef, active }: GestureDebugPanelProps) {
  const [display, setDisplay] = useState<GestureSnapshot | null>(null);
  const lastUpdateRef = useRef(0);
  const isMirrored = useCameraStore((state) => state.isMirrored);

  useAnimationFrame((time) => {
    if (time - lastUpdateRef.current < 100) return;
    lastUpdateRef.current = time;

    const snapshot = gestureRef.current;
    if (snapshot) {
      setDisplay({ ...snapshot });
    }
  }, active);

  if (!display) return null;

  return (
    <div className="w-full rounded-lg border border-gg-border bg-gg-bg-surface p-4 font-mono text-xs">
      <h3 className="mb-3 text-sm font-semibold text-gg-text-primary">
        Gesture Debug
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {isMirrored ? (
          <>
            <HandDebugInfo label="Left Hand" data={display.left} />
            <HandDebugInfo label="Right Hand" data={display.right} />
          </>
        ) : (
          <>
            <HandDebugInfo label="Right Hand" data={display.right} />
            <HandDebugInfo label="Left Hand" data={display.left} />
          </>
        )}
      </div>
    </div>
  );
}

function HandDebugInfo({
  label,
  data,
}: {
  label: string;
  data: GestureSnapshot["left"];
}) {
  const { state, detection } = data;

  return (
    <div className="space-y-1.5">
      <div className="text-gg-text-primary font-semibold">{label}</div>
      <Row
        label="Phase"
        value={state.phase}
        className={PHASE_COLORS[state.phase]}
      />
      <Row
        label="Detected"
        value={detection?.detected ? "Yes" : "No"}
        className={
          detection?.detected ? "text-emerald-400" : "text-gg-text-secondary"
        }
      />
      <Row
        label="Confidence"
        value={detection ? detection.confidence.toFixed(2) : "--"}
      />
      <Row
        label="Angle"
        value={
          detection?.detected ? `${detection.angleDegrees.toFixed(1)}°` : "--"
        }
      />
      <Row
        label="Hand Scale"
        value={detection ? detection.handScale.toFixed(3) : "--"}
      />
    </div>
  );
}

function Row({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gg-text-secondary">{label}</span>
      <span className={className ?? "text-gg-text-primary"}>{value}</span>
    </div>
  );
}

export default GestureDebugPanel;
