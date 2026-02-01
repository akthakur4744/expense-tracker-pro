import { TransactionListScreen } from 'app/features/transactions/screen'
import { Stack } from 'expo-router'

export default function Screen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Transactions',
                    headerShown: false,
                }}
            />
            <TransactionListScreen />
        </>
    )
}
