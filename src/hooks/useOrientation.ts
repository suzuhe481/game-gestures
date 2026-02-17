import { useEffect, useState } from "react";

type Orientation = "portrait" | "landscape";

const query = "(orientation: portrait)";

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(() =>
    window.matchMedia(query).matches ? "portrait" : "landscape",
  );

  useEffect(() => {
    const mql = window.matchMedia(query);

    function handleChange(e: MediaQueryListEvent) {
      setOrientation(e.matches ? "portrait" : "landscape");
    }

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return orientation;
}
