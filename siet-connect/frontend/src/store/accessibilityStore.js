import { create } from "zustand";

// Load saved preferences from localStorage
const getStored = (key, fallback) => {
  try {
    let val = localStorage.getItem(`siet_a11y_${key}`);
    if (val === null) return fallback;
    val = JSON.parse(val);
    // Migrate old "winter" theme to new "siet-light"
    if (key === "theme" && val === "winter") {
      localStorage.setItem("siet_a11y_theme", JSON.stringify("siet-light"));
      return "siet-light";
    }
    return val;
  } catch {
    return fallback;
  }
};

const useAccessibilityStore = create((set) => ({
  textSize: getStored("textSize", "medium"), // small | medium | large
  highContrast: getStored("highContrast", false),
  wideSpacing: getStored("wideSpacing", false),
  theme: getStored("theme", "night"), // night (dark) | siet-light (light)

  setTextSize: (size) => {
    localStorage.setItem("siet_a11y_textSize", JSON.stringify(size));
    set({ textSize: size });
  },

  toggleHighContrast: () => {
    set((state) => {
      const next = !state.highContrast;
      localStorage.setItem("siet_a11y_highContrast", JSON.stringify(next));
      return { highContrast: next };
    });
  },

  toggleWideSpacing: () => {
    set((state) => {
      const next = !state.wideSpacing;
      localStorage.setItem("siet_a11y_wideSpacing", JSON.stringify(next));
      return { wideSpacing: next };
    });
  },

  toggleTheme: () => {
    set((state) => {
      const next = state.theme === "night" ? "siet-light" : "night";
      localStorage.setItem("siet_a11y_theme", JSON.stringify(next));
      document.documentElement.setAttribute("data-theme", next);
      return { theme: next };
    });
  },
}));

export default useAccessibilityStore;
