import { ThemeProvider, useTheme } from './ThemeProvider'
import { Platform } from 'react-native'
import { TamaguiProvider, type TamaguiProviderProps } from 'tamagui'
import { config } from '@my/config'
import { AuthProvider } from './AuthProvider'

function TamaguiProviderWrapper({ children, defaultTheme, ...rest }: any) {
  const { theme: nativeTheme } = useTheme()

  // On Web, prioritize the passed defaultTheme (from NextTamaguiProvider)
  // On Native, use the theme from our persisted context
  const curTheme = Platform.OS === 'web' ? defaultTheme : nativeTheme

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={curTheme}
      {...rest}
    >
      {children}
    </TamaguiProvider>
  )
}

export function Provider({
  children,
  defaultTheme,
  ...rest
}: Omit<TamaguiProviderProps, 'config' | 'defaultTheme'> & { defaultTheme?: string }) {

  return (
    <ThemeProvider>
      <TamaguiProviderWrapper defaultTheme={defaultTheme} {...rest}>
        <AuthProvider>{children}</AuthProvider>
      </TamaguiProviderWrapper>
    </ThemeProvider>
  )
}
