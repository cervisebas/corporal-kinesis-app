import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme } from 'react-native-paper';

const CombinedTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
        ...PaperDarkTheme.colors,
        ...NavigationDarkTheme.colors,
        primary: '#ED7035',
        background: '#0B0C0E',
        card: '#ED7035',
        text: '#FFFFFF',
        surface: '#0B0C0E',
        accent: '#ED7035',
        onSurface: '#0B0C0E',
    },
    dark: true
};
export default CombinedTheme;