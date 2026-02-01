import { AddExpenseScreen } from 'app/features/add-expense/screen'
import { Stack } from 'expo-router'

export default function Screen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Add Expense',
                    headerShown: false,
                }}
            />
            <AddExpenseScreen />
        </>
    )
}
