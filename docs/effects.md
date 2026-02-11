# effects.md

## Effect Design Principles

- Effects are **independent** of gesture logic
- Effects have lifecycles and internal animation state
- Effects are positioned in world space derived from landmarks

---

## Effect Lifecycle

1. Spawn
2. Materialize
3. Animate / Pulse
4. Fade Out
5. Destroy

---

## Visual Style Goals

- Holographic blue color palette
- Glow and additive blending
- Subtle glitch artifacts
- Breathing scale animations

---

## Effect Inputs

- World position (x, y)
- Timestamp
- Optional direction or orientation

---

## Audio Coupling

- Effects may trigger audio
- Audio timing synchronized to materialization
- Audio decoupled from gesture logic
