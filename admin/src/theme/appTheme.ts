import {PaletteMode} from '@mui/material';
import {createTheme, ThemeOptions} from '@mui/material/styles';

// Define custom colors
declare module '@mui/material/styles' {
    interface Palette {
        customPurple: Palette['primary'];
        customGreen: Palette['primary'];
    }
    interface PaletteOptions {
        customPurple?: PaletteOptions['primary'];
        customGreen?: PaletteOptions['primary'];
    }
}

// Define constant colors
const PURPLE = {
    main: '#6e4b62',
    light: '#8f637e',
    dark: '#4d3444',
    contrastText: '#fff',
};

const GREEN = {
    main: '#8dbe54',
    light: '#a3ce71',
    dark: '#628541',
    contrastText: '#fff',
};

const LINK_COLORS = {
    light: {
        main: '#846aa6',
        hover: '#8f6db8',
    },
    dark: {
        main: '#e1bee7',
        hover: '#e8cbed',
    },
};

// Create theme settings based on mode
export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        primary: GREEN,
        secondary: PURPLE,
        customPurple: PURPLE,
        customGreen: GREEN,
        ...(mode === 'light'
            ? {
                // Light mode settings
                background: {
                    default: '#fff',
                    paper: '#fff',
                },
                text: {
                    primary: '#1C1C1C',
                    secondary: '#666666',
                },
            }
            : {
                // Dark mode settings
                background: {
                    default: '#1C1C1C',
                    paper: '#2C2C2C',
                },
                text: {
                    primary: '#fff',
                    secondary: '#B0B0B0',
                },
            }),
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: () => ({
                    color: mode === 'light' ? LINK_COLORS.light.main : LINK_COLORS.dark.main,
                    '&:hover': {
                        color: mode === 'light' ? LINK_COLORS.light.hover : LINK_COLORS.dark.hover,
                    },
                }),
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: `${PURPLE.main}14`, // 14 = 8% opacity
                    },
                    '&.Mui-selected': {
                        backgroundColor: `${PURPLE.main}1F`, // 1F = 12% opacity
                        '&:hover': {
                            backgroundColor: `${PURPLE.main}29`, // 29 = 16% opacity
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundColor: GREEN.main,
                    '&:hover': {
                        backgroundColor: GREEN.dark,
                    },
                },
                outlined: {
                    borderColor: GREEN.main,
                    color: GREEN.main,
                    '&:hover': {
                        borderColor: GREEN.dark,
                        backgroundColor: `${GREEN.main}14`,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: `${PURPLE.main}14`,
                    },
                },
            },
        },
    },
});

export const createAppTheme = (mode: PaletteMode) => {
    return createTheme(getThemeOptions(mode));
};