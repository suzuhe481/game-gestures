import { create } from "zustand";

type AudioState = {
  isMuted: boolean;
  toggleMute: () => void;
};

export const useAudioStore = create<AudioState>()((set) => ({
  isMuted: false,
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
}));
