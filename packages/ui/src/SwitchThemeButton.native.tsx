'use client'

import { Button } from 'tamagui'
import { useTheme } from 'app/provider/ThemeProvider'
import { Moon, Sun } from '@tamagui/lucide-icons'

export const SwitchThemeButton = () => {
  const { theme, toggle } = useTheme()

  return (
    <Button
      size="$3"
      onPress={toggle}
      icon={theme === 'dark' ? Moon : Sun}
      chromeless
    />
  )
}
