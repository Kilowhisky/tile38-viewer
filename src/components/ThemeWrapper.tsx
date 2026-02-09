import { createTheme, PaletteMode, ThemeProvider, useMediaQuery } from "@mui/material"
import { createContext, useMemo, useState } from "react"

// From here: https://medium.com/@itayperry91/react-and-mui-change-muis-theme-mode-direction-and-language-including-date-pickers-ad8e91af30ae

/**
 TypeScript and React inconvenience:
 These functions are in here purely for types!
 They will be overwritten - it's just that
 createContext must have an initial value.
 Providing a type that could be 'null | something'
 and initiating it with *null* would be uncomfortable :)
*/
export const ThemeWrapperContext = createContext({
  toggleColorMode: () => {},
})

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? "dark" : "light")
  const themeWrapperUtils = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === "light" ? "dark" : "light"))
      },
    }),
    []
  )
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  )

  return (
    <ThemeWrapperContext.Provider value={themeWrapperUtils}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeWrapperContext.Provider>
  )
}
