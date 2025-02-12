import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {CssBaseline, PaletteMode} from '@mui/material';
import {createAppTheme} from "src/theme/appTheme";

export const ColorModeContext = createContext({
    toggleColorMode: () => {},
    mode: 'dark' as PaletteMode
});

export const useColorMode = () => {
    return useContext(ColorModeContext);
};

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<PaletteMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as PaletteMode) || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode // Add mode to the context
        }),
        [mode],
    );

    const theme = useMemo(
        () => createAppTheme(mode),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};