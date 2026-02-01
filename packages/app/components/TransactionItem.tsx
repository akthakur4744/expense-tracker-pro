import { Paragraph, XStack, YStack } from '@my/ui'

export function TransactionItem({ icon: Icon, title, subtitle, amount, color, date }: any) {
    return (
        <XStack
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            padding="$3"
            backgroundColor="$background"
            borderRadius="$4"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 1 }}
            shadowOpacity={0.05}
            shadowRadius={5}
            elevation={2}
            marginBottom="$2"
        >
            <XStack gap="$3" alignItems="center" flex={1} flexShrink={1} position="relative">
                <YStack backgroundColor={color} padding="$2.5" borderRadius="$4" opacity={0.15} position="absolute" top={0} bottom={0} left={0} right={0} />
                <YStack padding="$2.5" borderRadius="$4">
                    <Icon color={color} size={20} />
                </YStack>
                <YStack flex={1}>
                    <Paragraph fontWeight="700" size="$3" numberOfLines={1}>{title}</Paragraph>
                    <Paragraph size="$1" color="$color10" numberOfLines={1}>{subtitle}</Paragraph>
                </YStack>
            </XStack>
            <YStack alignItems="flex-end" flexShrink={0} paddingLeft="$2">
                <Paragraph fontWeight="700" color={amount.startsWith('-') ? '$red10' : '$green10'}>{amount}</Paragraph>
                <Paragraph size="$1" color="$color9">{date}</Paragraph>
            </YStack>
        </XStack>
    )
}
