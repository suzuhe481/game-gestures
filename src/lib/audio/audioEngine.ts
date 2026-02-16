import { AUDIO_CLIPS } from "./audioConfig";

let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
const bufferCache = new Map<string, AudioBuffer>();
let initPromise: Promise<void> | null = null;

/**
 * Create the AudioContext, GainNode, and pre-load all audio clips.
 * Safe to call multiple times — subsequent calls return the same promise.
 * Should be called from a user-gesture event handler on mobile.
 */
export function initAudioContext(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    audioContext = new AudioContext();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    const clipPaths = Object.values(AUDIO_CLIPS);
    await Promise.all(clipPaths.map(loadClip));
  })();

  return initPromise;
}

/**
 * Resume a suspended AudioContext (mobile unlock).
 * Call on any user interaction (click/touch).
 */
export async function resumeAudioContext(): Promise<void> {
  if (audioContext && audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

async function loadClip(path: string): Promise<void> {
  if (!audioContext || bufferCache.has(path)) return;
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  bufferCache.set(path, audioBuffer);
}

/**
 * Play a clip by path. Creates a new AudioBufferSourceNode each time,
 * so multiple calls overlap naturally.
 * No-ops silently if the engine is not initialized or the clip is missing.
 */
export function playClip(clipPath: string): void {
  if (!audioContext || !gainNode) return;
  const buffer = bufferCache.get(clipPath);
  if (!buffer) return;

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(gainNode);
  source.start(0);
}

/** Set the global mute state via the GainNode. */
export function setMuted(muted: boolean): void {
  if (gainNode) {
    gainNode.gain.value = muted ? 0 : 1;
  }
}
