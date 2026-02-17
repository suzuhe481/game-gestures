import { create } from "zustand";

type CameraState = {
  isCameraEnabled: boolean;
  isDebugEnabled: boolean;
  isMirrored: boolean;
  enableCamera: () => void;
  disableCamera: () => void;
  toggleDebug: () => void;
  toggleMirror: () => void;
};

export const useCameraStore = create<CameraState>()((set) => ({
  isCameraEnabled: false,
  isDebugEnabled: false,
  isMirrored: true,
  enableCamera: () => set({ isCameraEnabled: true }),
  disableCamera: () => set({ isCameraEnabled: false }),
  toggleDebug: () => set((s) => ({ isDebugEnabled: !s.isDebugEnabled })),
  toggleMirror: () => set((s) => ({ isMirrored: !s.isMirrored })),
}));
