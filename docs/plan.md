# plan.md

## Phase 0 – App Shell & UI Basics

- Create basic single-page React app structure with pnpm, Vite, and Tailwind CCS v4
- Display project title (e.g. **Game Gestures**)
  - Title intentionally references game terminology
  - “GG” as a playful nod to _Git Gud_
- Add layout container for camera + effects
- Implement placeholder video component
  - Static placeholder or mock video element
  - Used until real camera feed is wired up
- Add simple UI controls
  - Dropdown for selecting active effect
  - Initial option: **Thumbs Up → Heart Effect**
  - Structure dropdown to support future effects
- Wire selected effect into app state
  - No gesture logic yet
  - Effect selection should flow into later gesture/effect system

---

## Phase 1 – Camera & Hand Tracking

- Access webcam via browser
- Render live video feed
- Integrate MediaPipe Hands
- Visualize raw hand landmarks (debug view)

---

## Phase 2 – Gesture Detection

- Implement thumbs-up detection
- Support one-hand and two-hand detection
- Add temporal smoothing and confidence thresholds
- Prevent flickering via gesture state machines

---

## Phase 3 – Effect System Foundation

- Create canvas overlay layer
- Define effect lifecycle (spawn → animate → destroy)
- Implement effect registry / manager
- Connect gesture events to effect triggers

---

## Phase 4 – Cinematic Heart Effect

- Flat blue line initialization
- Morph line into heart outline
- Fill heart shape
- Add glow, flashing, and scale pulsing
- Position effect relative to hand centroid

---

## Phase 5 – Audio Integration

- Load sound assets
- Play sound on effect trigger
- Prevent overlapping audio spam
- Handle mobile audio unlock

---

## Phase 6 – Gesture Combinations

- Detect double thumbs-up gesture
- Trigger heart effect from combined gesture
- Tune timing windows and cooldowns

---

## Phase 7 – Polish & Stability

- Reduce jitter
- Improve smoothing
- Tune thresholds
- Test across lighting conditions and devices

---

## Phase 8 – Optional Expansion

- Integrate MediaPipe Face Mesh
- Detect head orientation and motion deltas
- Trigger new effects from head movement

---
