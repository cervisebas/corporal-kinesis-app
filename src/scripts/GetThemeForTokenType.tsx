export interface ThemeToken {
    seed:           string;
    name:           string;
    description:    string;
    baseline:       boolean;
    extendedColors: any[];
    coreColors:     CoreColors;
    schemes:        Schemes;
    palettes:       Palettes;
    styles:         Styles;
    customColors:   any[];
}

export interface CoreColors {
    primary:        string;
    tertiary:       string;
    secondary:      string;
    neutral:        string;
    neutralVariant: string;
    error:          string;
}

export interface Palettes {
    primary:        Array<null | string>;
    secondary:      Array<null | string>;
    tertiary:       Array<null | string>;
    neutral:        Array<null | string>;
    neutralVariant: Array<null | string>;
    error:          Array<null | string>;
}

export interface Schemes {
    light:        Dark;
    dark:         Dark;
    androidLight: Android;
    androidDark:  Android;
}

export interface Android {
    colorAccentPrimary:          string;
    colorAccentPrimaryVariant:   string;
    colorAccentSecondary:        string;
    colorAccentSecondaryVariant: string;
    colorAccentTertiary:         string;
    colorAccentTertiaryVariant:  string;
    textColorPrimary:            string;
    textColorSecondary:          string;
    textColorTertiary:           string;
    textColorPrimaryInverse:     string;
    textColorSecondaryInverse:   string;
    textColorTertiaryInverse:    string;
    colorBackground:             string;
    colorBackgroundFloating:     string;
    colorSurface:                string;
    colorSurfaceVariant:         string;
    colorSurfaceHighlight:       string;
    surfaceHeader:               string;
    underSurface:                string;
    offState:                    string;
    accentSurface:               string;
    textPrimaryOnAccent:         string;
    textSecondaryOnAccent:       string;
    volumeBackground:            string;
    scrim:                       string;
}

export interface Dark {
    primary:                 string;
    onPrimary:               string;
    primaryContainer:        string;
    onPrimaryContainer:      string;
    primaryFixed:            string;
    onPrimaryFixed:          string;
    primaryFixedDim:         string;
    onPrimaryFixedVariant:   string;
    secondary:               string;
    onSecondary:             string;
    secondaryContainer:      string;
    onSecondaryContainer:    string;
    secondaryFixed:          string;
    onSecondaryFixed:        string;
    secondaryFixedDim:       string;
    onSecondaryFixedVariant: string;
    tertiary:                string;
    onTertiary:              string;
    tertiaryContainer:       string;
    onTertiaryContainer:     string;
    tertiaryFixed:           string;
    onTertiaryFixed:         string;
    tertiaryFixedDim:        string;
    onTertiaryFixedVariant:  string;
    error:                   string;
    errorContainer:          string;
    onError:                 string;
    onErrorContainer:        string;
    background:              string;
    onBackground:            string;
    outline:                 string;
    inverseOnSurface:        string;
    inverseSurface:          string;
    inversePrimary:          string;
    shadow:                  string;
    surfaceTint:             string;
    outlineVariant:          string;
    scrim:                   string;
    surface:                 string;
    onSurface:               string;
    surfaceVariant:          string;
    onSurfaceVariant:        string;
    surfaceContainerHighest: string;
    surfaceContainerHigh:    string;
    surfaceContainer:        string;
    surfaceContainerLow:     string;
    surfaceContainerLowest:  string;
    surfaceDim:              string;
    surfaceBright:           string;
}

export interface Styles {
    display:  Body;
    headline: Body;
    body:     Body;
    label:    Body;
    title:    Body;
}

export interface Body {
    large:  Large;
    medium: Large;
    small:  Large;
}

export interface Large {
    fontFamilyName:  FontFamilyName;
    fontFamilyStyle: FontFamilyStyle;
    fontWeight:      number;
    fontSize:        number;
    lineHeight:      number;
    letterSpacing:   number;
}

export enum FontFamilyName {
    Roboto = "Roboto",
}

export enum FontFamilyStyle {
    Medium = "Medium",
    Regular = "Regular",
}
