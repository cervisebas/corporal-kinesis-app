import { createContext, useState } from "react";
import { MD3DarkTheme, MD3Theme } from "react-native-paper";
import { Theme as NavTheme, DarkTheme as NavDarkTheme } from "@react-navigation/native";
import React from "react";
import { Theme, ThemeNavigation } from "../scripts/Theme";

export type ThemeContextType = {
    theme: MD3Theme;
    navTheme: NavTheme;
};
export const ThemeContext = createContext<ThemeContextType>({
    theme: MD3DarkTheme,
    navTheme: NavDarkTheme
});

export default React.memo(function ThemeProvider(props: { children: React.ReactNode; }) {
    const [theme, setTheme] = useState(Theme);
    const [navTheme, setNavTheme] = useState(ThemeNavigation);

    console.log(`Provider primary: ${theme.colors.primary}`);

    return(<ThemeContext.Provider value={{ theme, navTheme }}>
        {props.children}
    </ThemeContext.Provider>);
});