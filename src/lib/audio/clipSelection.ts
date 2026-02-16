import {
  AUDIO_CLIPS,
  RANDOMIZE_CLIPS,
  DOUBLE_GESTURE_MAX_DELAY_MS,
  DOUBLE_GESTURE_CLIP,
  DEFAULT_CLIP,
} from "./audioConfig";

const allClips = Object.values(AUDIO_CLIPS);

/**
 * Determine which audio clip to play based on the time since the last trigger.
 *
 * If two triggers occur within DOUBLE_GESTURE_MAX_DELAY_MS, the second
 * always uses DOUBLE_GESTURE_CLIP. Otherwise, randomly picks a clip
 * (when RANDOMIZE_CLIPS is true) or uses DEFAULT_CLIP.
 */
export function selectClip(
  lastTriggerTimestamp: number | null,
  currentTimestamp: number,
): string {
  if (lastTriggerTimestamp !== null) {
    const delta = currentTimestamp - lastTriggerTimestamp;
    if (delta <= DOUBLE_GESTURE_MAX_DELAY_MS) {
      return DOUBLE_GESTURE_CLIP;
    }
  }

  if (RANDOMIZE_CLIPS) {
    const index = Math.floor(Math.random() * allClips.length);
    return allClips[index];
  }

  return DEFAULT_CLIP;
}
