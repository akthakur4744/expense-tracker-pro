import {
    Button,
    Form,
    H3,
    Input,
    Label,
    Separator,
    Spinner,
    XStack,
    YStack,
    Paragraph,
    Text,
    ScrollView // Removed ScrollView from react-native (using universal scrollview if available, but Tamagui usually exports one)
} from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from 'app/config/firebase'
import { useRouter } from 'solito/navigation'
import { KeyboardAvoidingView, Platform } from 'react-native'

export function AddExpenseScreen({ onBack }: { onBack?: () => void }) {
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async () => {
        console.log('Submitting expense...')
        if (!db || !auth?.currentUser) {
            console.error('No DB instance or user not logged in')
            setError('Authentication required')
            return
        }
        if (!amount || !description || !category) {
            setError('Please fill all fields')
            return
        }

        const expenseDate = new Date(date)
        if (isNaN(expenseDate.getTime())) {
            setError('Invalid date format')
            return
        }

        setLoading(true)
        setError('')
        try {
            console.log("Adding document to firestore...");
            await addDoc(collection(db, 'transactions'), {
                amount: parseFloat(amount),
                description,
                category,
                type: 'expense', // Explicitly set type
                date: new Date(date).toISOString(),
                userId: auth.currentUser.uid,
                createdAt: new Date().toISOString()
            })
            console.log("Document added successfully");
            if (onBack) onBack()
            else router.back()
        } catch (e: any) { // Changed from `error` to `e: any`
            console.error('Error adding expense:', e) // Changed log message
            setError(e.message) // Changed from alert to setError
        } finally {
            setLoading(false)
        }
    }

    return (
        <YStack flex={1} backgroundColor="$background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <YStack flex={1} alignItems="center" paddingBottom="$10">
                        <YStack
                            width="100%"
                            maxWidth={600}
                            flex={1}
                            padding="$4"
                            gap="$6"
                        >
                            {/* Header */}
                            <XStack alignItems="center" gap="$3" marginTop="$4">
                                <Button circular size="$3" icon={ArrowLeft} onPress={onBack || (() => router.back())} unstyled />
                                <H3>Add Expense</H3>
                            </XStack>

                            <YStack gap="$6">
                                {/* Amount Input - Hero Style */}
                                <YStack alignItems="center" gap="$2" paddingVertical="$4">
                                    <Label color="$gray11" size="$3">AMOUNT</Label>
                                    <XStack
                                        alignItems="center"
                                        justifyContent="center"
                                        backgroundColor="$gray6"
                                        borderRadius="$4"
                                        borderWidth={1}
                                        borderColor="$gray9"
                                        paddingHorizontal="$4"
                                        paddingVertical="$2"
                                        minWidth={200}
                                        height={80}
                                    >
                                        <Text fontSize={32} fontWeight="600" color="$gray12" marginRight="$1" top={2}>$</Text>
                                        <Input
                                            id="amount"
                                            size="$6"
                                            borderWidth={0}
                                            backgroundColor="transparent"
                                            keyboardType="numeric"
                                            placeholder="0"
                                            value={amount}
                                            onChangeText={setAmount}
                                            fontSize={40}
                                            fontWeight="800"
                                            textAlign="center"
                                            width={140}
                                            height={60}
                                            color="$gray12"
                                            placeholderTextColor="$gray11"
                                            padding={0}
                                            style={{ lineHeight: 50 }}
                                        />
                                    </XStack>
                                </YStack>
                            </YStack>

                            <Form onSubmit={handleSubmit} gap="$5">
                                {/* Description Input */}
                                <YStack gap="$2">
                                    <Label htmlFor="description" fontWeight="600" color="$color">What is it for?</Label>
                                    <Input
                                        id="description"
                                        size="$5"
                                        borderWidth={1}
                                        borderColor="$gray9"
                                        backgroundColor="$gray6"
                                        placeholder="e.g. Grocery Shopping"
                                        value={description}
                                        onChangeText={setDescription}
                                        borderRadius="$4"
                                        color="$color"
                                        placeholderTextColor="$gray12"
                                    />
                                </YStack>

                                {/* Category Selection */}
                                <YStack gap="$3">
                                    <Label fontWeight="600" color="$color">Category</Label>
                                    <XStack flexWrap="wrap" gap="$3">
                                        {['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'].map(cat => (
                                            <Button
                                                key={cat}
                                                size="$4"
                                                borderWidth={1}
                                                borderColor={category === cat ? '$blue10' : '$borderColor'}
                                                backgroundColor={category === cat ? '$blue10' : 'transparent'}
                                                onPress={() => setCategory(cat)}
                                                borderRadius="$8"
                                            >
                                                <Text color={category === cat ? 'white' : '$color'} fontWeight="600">{cat}</Text>
                                            </Button>
                                        ))}
                                    </XStack>
                                </YStack>

                                {/* Date Input */}
                                <YStack gap="$2">
                                    <Label fontWeight="600" color="$color">Date</Label>
                                    <Input
                                        size="$5"
                                        borderWidth={1}
                                        borderColor="$gray9"
                                        backgroundColor="$gray6"
                                        placeholder="YYYY-MM-DD"
                                        value={date}
                                        onChangeText={setDate}
                                        borderRadius="$4"
                                        color="$color"
                                        placeholderTextColor="$gray12"
                                    />
                                </YStack>

                                {!!error && <Paragraph color="$red10" textAlign="center">{error}</Paragraph>}

                                <Button
                                    size="$6"
                                    marginTop="$4"
                                    backgroundColor="$pink10"
                                    borderWidth={0}
                                    disabled={loading}
                                    icon={loading ? <Spinner color="white" /> : undefined}
                                    onPress={handleSubmit}
                                    pressStyle={{ opacity: 0.8 }}
                                >
                                    <Text color="white" fontWeight="bold" fontSize="$5">{loading ? 'Adding...' : 'Add Expense'}</Text>
                                </Button>
                            </Form>
                        </YStack>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </YStack >
    )
}
