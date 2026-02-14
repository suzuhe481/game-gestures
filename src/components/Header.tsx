import { Bug, FlipHorizontal2 } from "lucide-react";
import EffectSelector from "@/components/EffectSelector";
import { useCameraStore } from "@/store/camera-store";
import { cn } from "@/lib/utils";

/**
 * Header component.
 *
 * This component renders a header element with a title, a toggle button
 * for mirror mode, a toggle button for debug overlay, and an effect
 * selector.
 *
 * The toggle buttons are only rendered when the camera is enabled.
 *
 * The mirror mode toggle button toggles the isMirrored state in the camera store,
 * and the debug overlay toggle button toggles the isDebugEnabled state in the
 * camera store.
 */
function Header() {
  const isCameraEnabled = useCameraStore((s) => s.isCameraEnabled);
  const isDebugEnabled = useCameraStore((s) => s.isDebugEnabled);
  const isMirrored = useCameraStore((s) => s.isMirrored);
  const toggleDebug = useCameraStore((s) => s.toggleDebug);
  const toggleMirror = useCameraStore((s) => s.toggleMirror);

  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-4">
      <h1 className="text-2xl font-bold tracking-tight text-gg-accent">
        Game Gestures
      </h1>
      <div className="flex items-center gap-2">
        {isCameraEnabled && (
          <>
            <button
              onClick={toggleMirror}
              className={cn(
                "rounded-md border p-1.5 transition-colors",
                isMirrored
                  ? "border-gg-accent/30 bg-gg-accent/10 text-gg-accent"
                  : "border-gg-border bg-transparent text-gg-text-secondary hover:text-gg-text-primary",
              )}
              aria-label="Toggle mirror mode"
              title="Toggle mirror mode"
            >
              <FlipHorizontal2 className="size-4" />
            </button>
            <button
              onClick={toggleDebug}
              className={cn(
                "rounded-md border p-1.5 transition-colors",
                isDebugEnabled
                  ? "border-gg-accent/30 bg-gg-accent/10 text-gg-accent"
                  : "border-gg-border bg-transparent text-gg-text-secondary hover:text-gg-text-primary",
              )}
              aria-label="Toggle debug overlay"
              title="Toggle debug overlay"
            >
              <Bug className="size-4" />
            </button>
          </>
        )}
        <EffectSelector />
      </div>
    </header>
  );
}

export default Header;
