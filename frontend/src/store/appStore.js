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
}));

export default useAppStore;
