
import { Popover, Button, Avatar, YStack, H4, Paragraph, XStack, Separator, SwitchThemeButton } from '@my/ui'
import { LogOut } from '@tamagui/lucide-icons'

export function ProfilePopover({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <Popover size="$5" allowFlip placement="bottom-end" modal>
      <Popover.Trigger asChild>
        <Button
          unstyled
          padding="$0"
          borderWidth={0}
          backgroundColor="transparent"
          hoverStyle={{ opacity: 0.8 }}
          pressStyle={{ opacity: 0.6 }}
        >
          <Avatar circular size="$4">
            <Avatar.Image src={user?.photoURL || "https://i.pravatar.cc/300"} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
        </Button>
      </Popover.Trigger>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        backgroundColor="$background"
        padding="$4"
        elevate
        zIndex={100000}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack gap="$3">
          <H4>{user?.displayName || 'User'}</H4>
          <Paragraph size="$2" color="$color10">{user?.email}</Paragraph>
          <XStack justifyContent="space-between" alignItems="center">
            <Paragraph size="$2">Theme</Paragraph>
            <SwitchThemeButton />
          </XStack>
          <Separator />
          <Button
            icon={LogOut}
            size="$3"
            theme="red"
            onPress={onLogout}
          >
            Logout
          </Button>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
