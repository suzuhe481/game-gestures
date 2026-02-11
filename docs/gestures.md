# gestures.md

## Gesture Philosophy

Gestures are **temporal patterns**, not single-frame conditions.

Each gesture:

- Has an entry condition
- Requires stability over time
- Emits a single event when confirmed

---

## Supported Gestures (Initial)

### Thumbs Up

- Thumb extended
- Other fingers folded
- Hand orientation within tolerance

### Double Thumbs Up

- Both hands detected
- Both confirm thumbs-up state
- Within defined time window

---

## Gesture State Model

```
IDLE → CANDIDATE → CONFIRMED → COOLDOWN → IDLE
```

This prevents flicker and repeated triggers.

---
