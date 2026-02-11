# architecture.md

## Overview

This project is a **single-page, real-time vision-based interaction app** that detects hand gestures from a live camera feed and renders cinematic, holographic visual effects in response.

The system is designed to be:

- Fully client-side (no backend)
- Real-time and low-latency
- Responsive for desktop or mobile
- Modular and extensible (new gestures, new effects)
- Friendly to AI-assisted development

---

## Tech Stack

### Core

- **pnpm** – Package Manager
- **React** – UI composition and state orchestration
- **Vite** – Build tool
- **TypeScript** – Strong typing across perception, gestures, and effects
- **MediaPipe Hands (Web)** – Real-time hand landmark detection
- **Tailwind CSS v4** – Styling and layout
- **Shadcn** – Component libary
- **Zustand** – State management

### Rendering

- **HTML5 Video** – Camera input
- **Canvas 2D (initially)** – Overlay rendering for holographic effects
- _(Optional later)_ WebGL / Three.js for advanced effects

---

## High-Level Architecture

```
Camera (MediaDevices)
        ↓
<video /> element
        ↓
Frame Processing Loop
        ↓
MediaPipe Hands
        ↓
Landmarks (21 pts / hand)
        ↓
Gesture Detection Layer
        ↓
Gesture Events
        ↓
Effect System
        ↓
Canvas Overlay Rendering
```

All systems consume the **same camera feed** and operate in a shared animation loop.

---

## Key Architectural Concepts

### 1. Single Camera Source

- One `<video>` element
- Shared across all perception systems
- Prevents redundant camera access

### 2. Separation of Concerns

- **Perception**: MediaPipe landmark extraction
- **Interpretation**: Gesture detection & state machines
- **Presentation**: Visual and audio effects

### 3. Event-Driven Effects

Gestures do not render directly. Instead they emit **gesture events**, which trigger effects.

---

## React Folder Structure

```
/src
  /components
    /camera
      CameraFeed.tsx
    /mediapipe
      HandsTracker.tsx
    /canvas
      EffectsCanvas.tsx
    /effects
      HeartEffect.ts
    /gestures
      useGestureState.ts
      detectThumbsUp.ts
    /ui
      DebugOverlay.tsx
  /hooks
    useAnimationFrame.ts
  /lib
    landmarks.ts
    math.ts
  App.tsx
```

---

## State Management

- Zustand stores, or local React state + refs when appropriate
- Gesture state stored as temporal state (not per-frame booleans)
- Effects managed via an effect queue or registry

No global state library is required.

---

## Styling

- Shadcn components used for building app components
- Tailwind used for layout and customizing UI elements
- Canvas visuals handled outside Tailwind
- Optional debug overlays styled with Tailwind

---

## Performance Considerations

- Use `requestAnimationFrame`
- Throttle gesture confirmation (cooldowns)
- Smooth landmarks using EMA or moving averages
- Avoid React re-renders in the render loop (use refs)

---
