import { useState } from 'react'
import { Button, useIsomorphicLayoutEffect } from 'tamagui'
import { useThemeSetting, useRootTheme } from '@tamagui/next-theme'
import { Moon, Sun } from '@tamagui/lucide-icons'

export const SwitchThemeButton = () => {
  const themeSetting = useThemeSetting()
  const [theme] = useRootTheme()
  const [clientTheme, setClientTheme] = useState<string | undefined>('light')

  useIsomorphicLayoutEffect(() => {
    setClientTheme(themeSetting.forcedTheme || themeSetting.current || theme)
  }, [themeSetting.current, themeSetting.resolvedTheme])

  const toggleTheme = () => {
    const nextTheme = clientTheme === 'dark' ? 'light' : 'dark'
    themeSetting.set(nextTheme)
    setClientTheme(nextTheme)
  }

  return (
    <Button
      size="$3"
      onPress={toggleTheme}
      icon={clientTheme === 'dark' ? Moon : Sun}
      chromeless
    />
  )
}
