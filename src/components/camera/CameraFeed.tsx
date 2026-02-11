import { useOrientation } from "@/hooks/useOrientation";
import { cn } from "@/lib/utils";

function CameraFeed() {
  const orientation = useOrientation();
  const isPortrait = orientation === "portrait";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-gg-border bg-gg-bg-surface",
        isPortrait ? "aspect-9/16 max-w-sm" : "aspect-video max-w-3xl",
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gg-text-secondary">
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
      </div>
    </div>
  );
}

export default CameraFeed;
