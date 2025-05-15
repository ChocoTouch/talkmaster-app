import { create } from "zustand";
import { Talk } from "../types/talks";

interface TalkStore {
  selectedTalk: Talk | null;
  setSelectedTalk: (talk: Talk) => void;
  clearSelectedTalk: () => void;
  updateTalkField: (field: keyof Talk, value: any) => void;
}

export const useTalkStore = create<TalkStore>((set) => ({
  selectedTalk: null,

  setSelectedTalk: (talk) => set({ selectedTalk: talk }),

  clearSelectedTalk: () => set({ selectedTalk: null }),

  updateTalkField: (field, value) =>
    set((state) =>
      state.selectedTalk
        ? {
            selectedTalk: {
              ...state.selectedTalk,
              [field]: value,
            },
          }
        : state
    ),
}));
