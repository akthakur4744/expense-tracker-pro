import { YStack, Paragraph, Spinner, H4 } from '@my/ui'
import { useEffect, useState } from 'react'
import { PieChart } from './PieChart'
import { collection, query, onSnapshot, where } from 'firebase/firestore'
import { db, auth } from 'app/config/firebase'

export function ExpenseChart() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!db || !auth?.currentUser) return
        // Fetch expenses filtered by user
        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', auth.currentUser.uid)
        )
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allTransactions = snapshot.docs.map(doc => doc.data())
            // Include explicit expenses OR items with no type (legacy/default)
            const expenses = allTransactions.filter((t: any) => t.type === 'expense' || !t.type)

            // Aggregate by category
            const categoryTotals = expenses.reduce((acc, curr: any) => {
                const cat = curr.category || 'Other'
                acc[cat] = (acc[cat] || 0) + (parseFloat(curr.amount) || 0)
                return acc
            }, {} as Record<string, number>)

            // Map to PieChart format
            const colors = ['$blue10', '$pink10', '$green10', '$orange10', '$purple10']
            const chartData = Object.keys(categoryTotals).map((cat, index) => ({
                label: cat,
                value: categoryTotals[cat],
                color: colors[index % colors.length]
            }))

            setData(chartData)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    if (loading) return <YStack height={200} alignItems="center" justifyContent="center"><Spinner /></YStack>

    return (
        <YStack backgroundColor="$background" padding="$4" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
            <H4 marginBottom="$4">Expenses by Category</H4>
            <PieChart data={data} size={180} />
        </YStack>
    )
}
