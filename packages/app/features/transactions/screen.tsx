
import {
    Button,
    H3,
    Input,
    Paragraph,
    ScrollView,
    Separator,
    XStack,
    YStack,
    Spinner
} from '@my/ui'
import { ArrowLeft, Search, Filter, ShoppingBag } from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore'
import { db, auth } from 'app/config/firebase'
import { TransactionItem } from 'app/components/TransactionItem'
import { useRouter } from 'solito/navigation'
import { useAuth } from 'app/provider/AuthProvider'

export function TransactionListScreen({ onBack }: { onBack?: () => void }) {
    const { user, loading: authLoading } = useAuth()
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (authLoading) return
        if (!db || !user) {
            setLoading(false)
            return
        }

        // Use 'transactions' and client-side sorting
        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid)
        )
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            data.sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt || a.date).getTime()
                const dateB = new Date(b.createdAt || b.date).getTime()
                return dateB - dateA
            })
            setTransactions(data)
            setLoading(false)
        })
        return unsubscribe
    }, [user, authLoading])

    const formatDate = (timestamp: any) => {
        if (!timestamp) return ''
        if (timestamp.toDate) return timestamp.toDate().toLocaleDateString()
        if (timestamp instanceof Date) return timestamp.toLocaleDateString()
        return new Date(timestamp).toLocaleDateString()
    }

    const router = useRouter()

    const filteredTransactions = transactions.filter(t =>
        t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const groupedTransactions = filteredTransactions.reduce((acc, t) => {
        const date = formatDate(t.date || t.createdAt)
        if (!acc[date]) acc[date] = []
        acc[date].push(t)
        return acc
    }, {} as Record<string, any[]>)

    return (
        <YStack flex={1} backgroundColor="$background" alignItems="center">
            <YStack
                width="100%"
                maxWidth={600}
                flex={1}
                padding="$4"
                gap="$4"
            >
                {/* Header */}
                <XStack alignItems="center" gap="$3">
                    <Button circular size="$3" icon={ArrowLeft} onPress={onBack || (() => router.back())} unstyled />
                    <H3>Transactions</H3>
                </XStack>

                {/* Search & Filter */}
                <XStack gap="$3" alignItems="center">
                    <XStack
                        flex={1}
                        borderWidth={1}
                        borderRadius="$4"
                        paddingHorizontal="$3"
                        alignItems="center"
                        backgroundColor="$gray6"
                        borderColor="$gray9"
                    >
                        <Search size="$1" color="$gray11" />
                        <Input
                            flex={1}
                            borderWidth={0}
                            unstyled
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            height={44}
                            color="$gray12"
                            placeholderTextColor="$gray11"
                        />
                    </XStack>
                    <Button size="$4" icon={Filter} chromeless />
                </XStack>

                <Separator />

                <ScrollView showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <Spinner size="large" color="$blue10" />
                    ) : (
                        <YStack gap="$2" paddingBottom="$10">
                            {Object.keys(groupedTransactions).map(date => (
                                <YStack key={date} gap="$1" marginBottom="$2">
                                    <Paragraph fontWeight="600" color="$color10" marginBottom="$1">{date}</Paragraph>
                                    {groupedTransactions[date].map(t => (
                                        <TransactionItem
                                            key={t.id}
                                            icon={ShoppingBag}
                                            title={t.category}
                                            subtitle={t.description}
                                            amount={`-$${t.amount}`}
                                            color="$pink10"
                                            date={date}
                                        />
                                    ))}
                                </YStack>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <Paragraph textAlign="center" color="$color10" marginTop="$4">No transactions found</Paragraph>
                            )}
                        </YStack>
                    )}
                </ScrollView>
            </YStack>
        </YStack>
    )
}
