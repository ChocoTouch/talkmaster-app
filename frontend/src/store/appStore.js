import { create } from "zustand";

const useAppStore = create((set) => ({
  // État global
  user: null,
  theme: "light",

  // Actions
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  
  selectedTalk: null, // L'état initial du talk sélectionné
  setSelectedTalk: (talk) => set({ selectedTalk: talk }), // Méthode pour définir un talk sélectionné
}));

export default useAppStore;
