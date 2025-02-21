import React, { createContext, useContext, useState, ReactNode } from "react";

interface Theme {
  primary: string;
  background: string;
  text: string;
}

const themes: { [key: string]: Theme } = {
  red: {
    primary: "#ff0000",
    background: "#fff5f5",
    text: "#000000",
  },
  black: {
    primary: "#000000",
    background: "#f5f5f5",
    text: "#000000",
  },
  royalBlue: {
    primary: "#4169e1",
    background: "#f5f5ff",
    text: "#000000",
  },
  green: {
    primary: "#008000",
    background: "#f5fff5",
    text: "#000000",
  },
  purple: {
    primary: "#800080",
    background: "#f5f5ff",
    text: "#000000",
  },
  orange: {
    primary: "#ffa500",
    background: "#fff5e5",
    text: "#000000",
  },
  pink: {
    primary: "#ffc0cb",
    background: "#fff5f5",
    text: "#000000",
  },
  teal: {
    primary: "#008080",
    background: "#f5ffff",
    text: "#000000",
  },
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (themeName: string) => void;
}>({
  theme: themes.red,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(themes.red);

  const changeTheme = (themeName: string) => {
    setTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
