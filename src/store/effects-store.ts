import { create } from "zustand";

type Effect = {
  id: string;
  label: string;
  gesture: string;
  gameName: string;
  gestureDescription: string;
};

type EffectsState = {
  effects: Effect[];
  selectedEffectId: string;
  selectEffect: (id: string) => void;
};

const EFFECTS: Effect[] = [
  {
    id: "thumbs-up-heart",
    label: "Thumbs Up \u2192 Heart Effect",
    gesture: "thumbs-up",
    gameName: "Death Stranding",
    gestureDescription: "Do a thumbs up",
  },
];

export const useEffectsStore = create<EffectsState>()((set) => ({
  effects: EFFECTS,
  selectedEffectId: EFFECTS[0].id,
  selectEffect: (id: string) => set({ selectedEffectId: id }),
}));
