'use client';

import { useTheme as useThemeBase } from "next-themes";
import { useMemo } from "react";

export const useThemeNormalized = (defaultTheme: "light" | "dark" = "light") => {
    const { theme: _theme, systemTheme, setTheme } = useThemeBase();

    const theme = useMemo(() => {
        if (_theme === "system") {
            return systemTheme ?? defaultTheme;
        }

        return _theme ?? defaultTheme;
    }, [_theme, systemTheme, defaultTheme]);

    return {
        theme,
        systemTheme,
        setTheme,
    };
}