import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";
import { DefaultTheme, DarkTheme, Theme as NavTheme } from "@react-navigation/native";
import { ThemeToken } from "./GetThemeForTokenType";
import rgbaToRgb from "rgba-to-rgb";
import Color from "color";

export default function (json: ThemeToken, theme: 'light' | 'dark'): MD3Theme {
    const useToken = (theme == 'dark')? json.schemes.dark: json.schemes.light;

    const DTheme = (theme == 'dark')? MD3DarkTheme: MD3LightTheme;
    const Background = Color(useToken.background).rgb().string();
    const primaryRGB = Color(useToken.primary).rgb();

    return {
        ...DTheme,
        colors: {
            ...DTheme.colors,
            primary: useToken.primary,
            primaryContainer: useToken.primaryContainer,
            secondary: useToken.secondary,
            secondaryContainer: useToken.secondaryContainer,
            tertiary: useToken.tertiary,
            tertiaryContainer: useToken.tertiaryContainer,
            surface: useToken.surface,
            surfaceVariant: useToken.surfaceVariant,
            surfaceDisabled: Color(useToken.surface)
                .alpha(0.12)
                .rgb()
                .string(),
            background: useToken.background,
            error: useToken.error,
            errorContainer: useToken.errorContainer,
            onPrimary: useToken.onPrimary,
            onPrimaryContainer: useToken.onPrimaryContainer,
            onSecondary: useToken.onSecondary,
            onSecondaryContainer: useToken.onSecondaryContainer,
            onTertiary: useToken.onTertiary,
            onTertiaryContainer: useToken.onTertiaryContainer,
            onSurface: useToken.onSurface,
            onSurfaceVariant: useToken.onSurfaceVariant,
            onSurfaceDisabled: Color(useToken.onSurface)
                .alpha(0.38)
                .rgb()
                .string(),
            onError: useToken.onError,
            onErrorContainer: useToken.onErrorContainer,
            onBackground: useToken.onBackground,
            outline: useToken.outline,
            outlineVariant: useToken.outlineVariant,
            inverseSurface: useToken.inverseSurface,
            inverseOnSurface: useToken.inverseOnSurface,
            inversePrimary: useToken.inversePrimary,
            shadow: useToken.shadow,
            scrim: useToken.scrim,
            elevation: {
                level0: 'transparent',
                // Note: Color values with transparency cause RN to transfer shadows to children nodes
                // instead of View component in Surface. Providing solid background fixes the issue.
                // Opaque color values generated with `palette.primary99` used as background
                level1: rgbaToRgb(Background, primaryRGB.alpha(0.05).string()), // palette.primary40, alpha 0.05
                level2: rgbaToRgb(Background, primaryRGB.alpha(0.08).string()), // palette.primary40, alpha 0.08
                level3: rgbaToRgb(Background, primaryRGB.alpha(0.11).string()), // palette.primary40, alpha 0.11
                level4: rgbaToRgb(Background, primaryRGB.alpha(0.12).string()), // palette.primary40, alpha 0.12
                level5: rgbaToRgb(Background, primaryRGB.alpha(0.14).string()), // palette.primary40, alpha 0.14
            }
        }
    };
};

export function GetThemeNavigation(theme: MD3Theme): NavTheme {
    const dTheme = (theme.dark)? DefaultTheme: DarkTheme;
    return {
        ...dTheme,
        colors: {
            ...dTheme.colors,
            background: theme.colors.background,
            card: theme.colors.elevation.level2,
            primary: theme.colors.secondaryContainer,
            text: theme.colors.onSurface
        }
    };
}