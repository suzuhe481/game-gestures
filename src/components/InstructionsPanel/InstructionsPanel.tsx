import { useEffectsStore } from "@/store/effects-store";

function InstructionsPanel() {
  const selectedEffect = useEffectsStore((s) =>
    s.effects.find((e) => e.id === s.selectedEffectId),
  );

  if (!selectedEffect) return null;

  return (
    <div className="w-full">
      {/* Top accent — holographic scan line */}
      <div className="h-px bg-linear-to-r from-transparent via-gg-accent/40 to-transparent" />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-gg-bg-surface/50 px-4 py-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="size-1.5 shrink-0 rounded-full bg-gg-accent shadow-[0_0_6px_var(--gg-accent-glow)]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gg-text-secondary">
            Active Effect
          </span>
        </div>

        {/* Separator */}
        <div
          className="hidden h-4 w-px bg-gg-border/40 sm:block"
          aria-hidden="true"
        />

        {/* Game field */}
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-gg-text-secondary/70">
            Game
          </span>
          <span className="text-sm font-medium text-gg-text-primary">
            {selectedEffect.gameName}
          </span>
        </div>

        {/* Separator */}
        <div
          className="hidden h-4 w-px bg-gg-border/40 sm:block"
          aria-hidden="true"
        />

        {/* Gesture field */}
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-gg-text-secondary/70">
            Gesture
          </span>
          <span className="text-sm font-medium text-gg-accent">
            {selectedEffect.gestureDescription}
          </span>
        </div>
      </div>

      {/* Bottom accent — fainter mirror */}
      <div className="h-px bg-linear-to-r from-transparent via-gg-accent/20 to-transparent" />
    </div>
  );
}

export default InstructionsPanel;
