# Styling & Visual Design

This document describes the **visual language, theming strategy, and styling principles** for the Gesture-Driven Holographic Effects app.

The goal is to create a UI that feels **cinematic, restrained, and game-inspired**, while keeping the focus on the live camera feed and holographic effects.

---

## Overall Visual Direction

- **Dark-themed by default**
- Not pure black — favor **dark gray / deep blue tones**
- Minimal UI chrome
- High contrast between UI and holographic effects
- UI should feel like a _supporting system_, not the star

The visuals should evoke:

- Sci-fi interfaces
- Game HUDs
- Diegetic UI elements

---

## Base Theme (Initial)

### Background

- Primary background: dark gray-blue
- Subtle gradient preferred over flat color
- No harsh blacks to preserve detail

### Text

- Primary text: off-white / light gray
- Secondary text: muted gray
- Avoid pure white for comfort

### Accents

- Accent color: holographic blue
- Used sparingly for:
  - Active UI elements
  - Focus states
  - Selected dropdown options

---

## Layout Principles

- Single-page layout
- Centered camera/effect area
- UI controls positioned away from main visual focus
  - Top or bottom edge of screen

- Generous spacing
- Avoid visual clutter

---

## UI Components

### Title

- Simple, bold typography
- Minimal decoration
- Example:
  - **Game Gestures**

- May include subtle glow or accent underline

---

### Effect Selector (Dropdown)

- Simple, unobtrusive dropdown
- Dark background with light text
- Clear visual indicator for active selection
- Styled to feel like a game settings menu

---

### Debug UI (Optional)

- Toggled on/off
- Smaller text
- Muted colors
- Never visually compete with effects

---

## Holographic Effects Styling

Effects are **not styled with Tailwind** and instead live in the canvas rendering layer.

Visual goals:

- Holographic blue color palette
- Glow and bloom
- Additive or screen blending
- Slight transparency
- Subtle noise or glitch artifacts

Effects should feel:

- Lightweight
- Ephemeral
- Responsive to motion

---

## Motion & Animation

- Smooth easing (no sharp linear motion)
- Small scale pulsing (“breathing”)
- Short glitch bursts
- Gentle fade-in and fade-out

Avoid:

- Long or distracting animations
- Overly aggressive glitching

---

## Sound Design (Visual Tie-In)

- Sounds should match the visual intensity
- Soft digital chirps or synth tones
- No harsh or loud effects

Sound reinforces visuals but should not dominate.

---

## Future: Gesture-Based Themes

The app may later support **dynamic theming based on selected gesture or game inspiration**.

Conceptually:

- Each gesture = one theme
- Theme controls:
  - Accent colors
  - Glow hue
  - UI highlight color
  - Effect palette

Examples:

- Thumbs Up → Blue holographic theme
- Future gestures → alternate color schemes

Implementation should allow:

- Theme tokens
- Easy swapping via app state
- No hard-coded colors in components

---

## Tailwind Strategy

- Tailwind used for:
  - Layout
  - Typography
  - UI components

- Canvas effects remain separate

Prefer:

- Design tokens
- CSS variables for theme colors
- Tailwind config extensibility

---

## Styling Principles Summary

- Dark, cinematic, restrained
- UI supports the experience — never competes
- Effects are the visual payoff
- Design for extension, not one-off styling
