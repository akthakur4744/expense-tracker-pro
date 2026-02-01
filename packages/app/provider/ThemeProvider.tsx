import { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme, Appearance } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Theme = 'light' | 'dark'

type ThemeContextType = {
    theme: Theme
    toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggle: () => { },
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme()
    const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? 'dark' : 'light')

    useEffect(() => {
        // Load saved theme
        AsyncStorage.getItem('app_theme').then((saved) => {
            if (saved) {
                setTheme(saved as Theme)
            }
        })
    }, [])

    const toggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        AsyncStorage.setItem('app_theme', newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
