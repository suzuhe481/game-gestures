/** MediaPipe hand landmark indices for the 21-point hand model. */
export const HAND_LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5,
  INDEX_FINGER_PIP: 6,
  INDEX_FINGER_DIP: 7,
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9,
  MIDDLE_FINGER_PIP: 10,
  MIDDLE_FINGER_DIP: 11,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13,
  RING_FINGER_PIP: 14,
  RING_FINGER_DIP: 15,
  RING_FINGER_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
} as const;

/** Non-thumb finger definitions for curl detection. */
export const CURL_FINGERS = [
  { name: "INDEX", tip: 8, pip: 6, mcp: 5 },
  { name: "MIDDLE", tip: 12, pip: 10, mcp: 9 },
  { name: "RING", tip: 16, pip: 14, mcp: 13 },
  { name: "PINKY", tip: 20, pip: 18, mcp: 17 },
] as const;
