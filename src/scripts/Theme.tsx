import { MD3Theme } from "react-native-paper";
import { Theme as NavTheme } from "@react-navigation/native";
import tokens from "./theme.json";
import GetThemeForToken, { GetThemeNavigation } from "./GetThemeForToken";

export const Theme: MD3Theme = GetThemeForToken(tokens as any, 'dark');
export const ThemeNavigation: NavTheme = GetThemeNavigation(Theme);