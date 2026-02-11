# Game Gestures

## Gesture-Driven Holographic Effects

A **real-time, vision-based interaction app** that detects hand gestures from a live camera feed and renders cinematic, holographic visual effects in response.

Inspired by the expressive gesture feedback seen in games like _Death Stranding_, this project explores how **human motion**, **perception**, and **frontend animation systems** can combine to create playful, immersive UI experiences — entirely in the browser.

---

## ✨ What This App Does

- Uses a live webcam feed to detect **hand gestures in real time**
- Interprets gestures such as **thumbs up** and **double thumbs up**
- Triggers **holographic visual effects** that materialize above the user’s hands
- Renders effects with glow, glitch, outline, and pulse animations
- Plays synchronized sound effects for added impact

All processing happens **client-side**, with no backend or model training required.

---

## 🧠 How It Works (High Level)

1. The browser camera provides a live video stream
2. **MediaPipe Hands** extracts hand landmarks from each frame
3. A gesture interpretation layer analyzes landmark motion over time
4. Confirmed gestures emit events
5. An effect system renders cinematic visuals on a canvas overlay

The app is built as a **perception → interpretation → presentation** pipeline, making it easy to extend with new gestures or effects.

---

## 🛠 Tech Stack

- **pnpm** – Package Manager
- **React** – UI composition and orchestration
- **Vite** – Build tool
- **TypeScript** – Strong typing across perception, gestures, and effects
- **Shadcn** – Component library
- **MediaPipe Hands (Web)** – Real-time hand landmark detection
- **Tailwind CSS v4** – Styling and layout
- **HTML5 Video + Canvas** – Camera input and visual rendering

Everything runs in the browser as a **single-page application**.

---

## 🧩 Architecture Highlights

- **Single camera source** shared across all systems
- **Reusable React components** organized by responsibility
- **Event-driven gesture system** (gestures do not render directly)
- **Effect lifecycle model** (spawn → materialize → animate → destroy)
- **Temporal gesture state machines** to prevent flicker and false positives

The architecture is intentionally modular to support future expansion.

---

## 🧪 Current Gestures & Effects

### Gestures

- 👍 Thumbs Up (single hand)
- 👍👍 Double Thumbs Up (both hands)

### Effects

- Holographic heart materialization
  - Flat line → heart outline → filled heart
  - Glow, flashing, glitch accents
  - Subtle scale pulsing
  - Positioned relative to hand location

---

## 🚧 Planned / Optional Expansions

- Head tracking using MediaPipe Face Mesh
- Head-orientation–based effect triggers
- Additional gesture combinations
- More advanced visual effects (WebGL / Three.js)

---

## 🎯 Project Goals

This project is intentionally built as a **creative, exploratory system**, not a production SDK. The goals are to:

- Explore real-time, camera-based interaction
- Build expressive gesture-driven feedback loops
- Practice perception-driven UI design
- Create a visually compelling demo that blends frontend and vision concepts

---

## ⚠️ Notes

- Requires camera access to function
- Best experienced on desktop browsers with good lighting
- Gesture thresholds and effects are tuned experimentally

---

## 📜 License

MIT

---

## 🙌 Acknowledgements

- Google **MediaPipe** for real-time hand tracking
- _Death Stranding_ for inspiration around gesture-driven feedback and holographic UI
