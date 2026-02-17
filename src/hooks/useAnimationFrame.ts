import { useEffect, useRef } from "react";

/**
 * Calls the given callback function on each animation frame
 * when the active prop is true.
 *
 * @param {Function} callback - The function to be called on each animation frame.
 * @param {boolean} active - Whether the animation loop should be running.
 */
export function useAnimationFrame(
  callback: (time: number) => void,
  active: boolean,
): void {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!active) return;

    let rafId: number;

    function loop(time: number) {
      callbackRef.current(time);
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [active]);
}
