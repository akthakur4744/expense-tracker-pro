'use client'

import {
  Button,
  H1,
  H4,
  Paragraph,
  Separator,
  SwitchThemeButton,
  XStack,
  YStack,
  Card,
  Avatar,
  Text,
  Anchor,
  Popover,
  Adapt,
  Spinner,
} from '@my/ui'
import { ScrollView } from 'react-native'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  Plus,
  ShoppingBag,
  Coffee,
  Car,
  LogOut,
} from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { LinearGradient } from 'tamagui/linear-gradient'
import { useRouter } from 'solito/navigation'
import { Link } from 'solito/link'
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from 'app/config/firebase'
import { ExpenseChart } from 'app/components/Chart'
import { TransactionItem } from 'app/components/TransactionItem'
import { useAuth } from 'app/provider/AuthProvider' // Changed useAuth import path
import { ProfilePopover } from './ProfilePopover'

export function HomeScreen() {
  const { user, loading: authLoading } = useAuth() // Added useAuth hook
  const router = useRouter()
  const [loading, setLoading] = useState(false) // Added loading state
  const [transactions, setTransactions] = useState<any[]>([])
  const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0 })

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [user, authLoading])

  useEffect(() => {
    if (authLoading) return
    if (!user || !db) return

    // Fetch all for stats (filtered by userId)
    // Removed orderBy to fix "missing index" error -> sorting client-side
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Client-side sort by date descending
      allDocs.sort((a: any, b: any) => {
        const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date)
        const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })

      setTransactions(allDocs.slice(0, 5))

      const income = allDocs
        .filter((t: any) => t.type === 'income')
        .reduce((acc, t: any) => acc + Number(t.amount), 0)

      const expense = allDocs
        .filter((t: any) => t.type === 'expense')
        .reduce((acc, t: any) => acc + Number(t.amount), 0)

      setStats({
        balance: income - expense,
        income,
        expense
      })
    })
    return unsubscribe
  }, [user, authLoading])

  const handleLogout = async () => {
    console.log("Logout initiated");
    if (!auth) {
      console.error("Auth is null during logout");
      return;
    }
    try {
      await signOut(auth)
      console.log("SignOut successful, redirecting to login");
      router.replace('/login')
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ''
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString()
    if (timestamp instanceof Date) return timestamp.toLocaleDateString()
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <YStack paddingTop="$8" paddingHorizontal="$4" gap="$4">

          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Paragraph color="$color10" size="$3">Good Morning,</Paragraph>
              <H4>{auth?.currentUser?.displayName || 'User'}</H4>
            </YStack>
            <XStack gap="$3">
              <ProfilePopover user={auth?.currentUser} onLogout={handleLogout} />
            </XStack>
          </XStack>

          {/* Balance Card */}
          <Card
            size="$4"
            borderWidth={0}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.1}
            shadowRadius={12}
            elevation={5}
            scale={0.98}
            hoverStyle={{ scale: 0.995 }}
            pressStyle={{ scale: 0.97 }}
            overflow="hidden"
            backgroundColor="#7928CA"
          >
            <LinearGradient
              width="100%"
              height="100%"
              colors={['#FF0080', '#7928CA']}
              start={[0, 0]}
              end={[1, 1]}
              position="absolute"
            />
            <YStack padding="$5" gap="$2">
              <Paragraph color="white" opacity={0.8} fontWeight="600">Current Balance</Paragraph>
              <H1 color="white" fontWeight="800">${stats.balance.toFixed(2)}</H1>
              <XStack justifyContent="space-between" marginTop="$4">
                <XStack gap="$2" alignItems="center" backgroundColor="rgba(255,255,255,0.2)" padding="$2" borderRadius="$4">
                  <ArrowDownLeft color="#4ade80" size={20} />
                  <YStack>
                    <Text color="white" fontSize={12} opacity={0.8}>Income</Text>
                    <Text color="white" fontWeight="bold">${stats.income.toFixed(0)}</Text>
                  </YStack>
                </XStack>
                <XStack gap="$2" alignItems="center" backgroundColor="rgba(255,255,255,0.2)" padding="$2" borderRadius="$4">
                  <ArrowUpRight color="#f87171" size={20} />
                  <YStack>
                    <Text color="white" fontSize={12} opacity={0.8}>Expense</Text>
                    <Text color="white" fontWeight="bold">${stats.expense.toFixed(0)}</Text>
                  </YStack>
                </XStack>
              </XStack>
            </YStack>
          </Card>

          {/* Chart Visualization */}
          <ExpenseChart />

          {/* Actions */}
          <XStack justifyContent="space-around" paddingVertical="$2">
            <ActionIcon icon={Plus} label="Add" color="$pink10" onPress={() => router.push('/add-expense')} />
            <ActionIcon icon={CreditCard} label="Cards" color="$blue10" onPress={() => router.push('/transactions')} />
            <ActionIcon icon={DollarSign} label="Send" color="$green10" onPress={() => alert("Send feature coming soon!")} />
            <ActionIcon icon={MoreHorizontal} label="More" color="$gray10" onPress={() => alert("More features coming soon!")} />
          </XStack>

          <Separator />

          {/* Recent Transactions */}
          <YStack gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <H4>Recent Transactions</H4>
              <Link href="/transactions">
                <Paragraph color="$blue10" fontWeight="600" cursor="pointer">View All</Paragraph>
              </Link>
            </XStack>

            <YStack gap="$2" paddingBottom="$10">
              {transactions.map((t) => (
                <TransactionItem
                  key={t.id}
                  icon={ShoppingBag}
                  title={t.category}
                  subtitle={t.description}
                  amount={`-$${t.amount}`}
                  color="$pink10"
                  date={formatDate(t.date || t.createdAt)}
                />
              ))}
              {transactions.length === 0 && (
                <Paragraph color="$color10" textAlign="center">No recent transactions</Paragraph>
              )}
            </YStack>
          </YStack>

        </YStack>
      </ScrollView>
    </YStack>
  )
}

function ActionIcon({ icon: Icon, label, color, onPress }: { icon: any, label: string, color: string, onPress?: () => void }) {
  return (
    <YStack alignItems="center" gap="$2" onPress={() => {
      console.log(`Action checking: ${label}`)
      if (onPress) onPress()
    }} pressStyle={{ opacity: 0.7 }}>
      <XStack
        width={50}
        height={50}
        borderRadius={25}
        backgroundColor={color as any}
        justifyContent="center"
        alignItems="center"
      >
        <Icon size={24} color="white" />
      </XStack>
      <Paragraph size="$2" color="$color10" fontWeight="600">{label}</Paragraph>
    </YStack>
  )
}
