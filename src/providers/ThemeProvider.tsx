import { createContext, useState } from "react";
import { MD3DarkTheme, MD3Theme } from "react-native-paper";
import { Theme as NavTheme, DarkTheme as NavDarkTheme } from "@react-navigation/native";
import React from "react";
import { Theme, ThemeNavigation } from "../scripts/Theme";

export type ThemeStatus = {
    color: string;
    style: 'light' | 'dark';
};
const defaultThemeStatus: ThemeStatus = {
    color: '#0f4577',
    style: 'light'
};

export type ThemeContextType = {
    theme: MD3Theme;
    navTheme: NavTheme;
    themeStatus: ThemeStatus[];
    setTheme: (t: MD3Theme)=>void;
    setNavTheme: (nt: NavTheme)=>void;
    setThemeStatus: (newTheme: (ThemeStatus | undefined)[])=>void;
};
export const ThemeContext = createContext<ThemeContextType>({
    theme: MD3DarkTheme,
    navTheme: NavDarkTheme,
    themeStatus: [defaultThemeStatus, defaultThemeStatus],
    setTheme: (_t)=>{},
    setNavTheme: (_nt)=>{},
    setThemeStatus: (_nt)=>{}
});

export default React.memo(function ThemeProvider(props: { children: React.ReactNode; }) {
    const [theme, setTheme] = useState(Theme);
    const [navTheme, setNavTheme] = useState(ThemeNavigation);
    const [themeStatus, _setThemeStatus] = useState([defaultThemeStatus, defaultThemeStatus]);

    function check(compare: ThemeStatus[]): boolean {
        const theme0c = themeStatus[0].color, theme0s = themeStatus[0].style;
        const theme1c = themeStatus[1].color, theme1s = themeStatus[1].style;
        const aTheme0c = compare[0].color, aTheme0s = compare[0].style;
        const aTheme1c = compare[1].color, aTheme1s = compare[1].style;
        return (theme0c == aTheme0c && theme1c == aTheme1c && theme0s == aTheme0s && theme1s == aTheme1s);
    }
    function setThemeStatus(newTheme: (ThemeStatus | undefined)[]) {
        const status = theme.colors.background;
        const styles: "light" | "dark" = (!theme.dark)? 'dark': 'light';
        const set = { color: status, style: styles };
        const newTheme2: ThemeStatus[] = [(newTheme[0])? newTheme[0]: set, (newTheme[1])? newTheme[1]: set];
        if (check(newTheme2)) return;
        _setThemeStatus(newTheme2);
    }

    return(<ThemeContext.Provider value={{
        theme,
        navTheme,
        themeStatus,
        setTheme,
        setNavTheme,
        setThemeStatus
    }}>
        {props.children}
    </ThemeContext.Provider>);
});