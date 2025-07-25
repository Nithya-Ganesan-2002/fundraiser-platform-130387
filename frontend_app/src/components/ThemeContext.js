import React from "react";

// PUBLIC_INTERFACE
export const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
});
export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;
