/** Paths to audio clips (relative to public root). */
export const AUDIO_CLIPS = {
  DEFAULT: "/assets/audio/DeathStrandingLike.mp3",
  EXTENDED: "/assets/audio/DeathStrandingLikeExtended.mp3",
} as const;

/** When true, randomly pick between clips on each trigger. When false, always use DEFAULT_CLIP. */
export const RANDOMIZE_CLIPS = true;

/** Maximum delay (ms) between two gesture triggers to count as a "double gesture". */
export const DOUBLE_GESTURE_MAX_DELAY_MS = 300;

/** Which clip to force on the second trigger of a double gesture. */
export const DOUBLE_GESTURE_CLIP = AUDIO_CLIPS.EXTENDED;

/** The clip used when RANDOMIZE_CLIPS is false. */
export const DEFAULT_CLIP = AUDIO_CLIPS.DEFAULT;
