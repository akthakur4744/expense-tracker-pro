import {
    Button,
    Form,
    H3,
    Input,
    Label,
    Spinner,
    YStack,
    Paragraph,
    XStack,
    ScrollView
} from '@my/ui'
import { useState, useEffect } from 'react'
import { useRouter } from 'solito/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from 'app/config/firebase'
import { useAuth } from 'app/provider/AuthProvider'
import { KeyboardAvoidingView, Platform } from 'react-native'

export function SignupScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()

    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/')
        }
    }, [user, authLoading])

    const handleSignup = async () => {
        if (!auth) {
            setError("Firebase config missing")
            return
        }
        if (!name || !email || !password) {
            setError("Please fill in all fields")
            return
        }
        setLoading(true)
        setError('')
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            // Update profile with name
            await updateProfile(userCredential.user, {
                displayName: name,
                photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            })
            router.push('/')
        } catch (e: any) {
            setError(getErrorMessage(e.code))
        } finally {
            setLoading(false)
        }
    }

    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Email is already in use.'
            case 'auth/invalid-email':
                return 'Invalid email address.'
            case 'auth/operation-not-allowed':
                return 'Email/password accounts are not enabled.'
            case 'auth/weak-password':
                return 'Password is too weak. Please use a stronger password.'
            default:
                return 'An unexpected error occurred. Please try again.'
        }
    }

    return (
        <YStack flex={1} backgroundColor="$background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
                        <YStack width="100%" maxWidth={400} gap="$4">
                            <H3 textAlign="center">Create Account</H3>
                            <Paragraph textAlign="center" color="$color10">Sign up to start tracking</Paragraph>

                            <Form onSubmit={handleSignup} gap="$4">
                                <YStack gap="$2">
                                    <Label htmlFor="name" color="$color">Full Name</Label>
                                    <Input
                                        id="name"
                                        size="$4"
                                        placeholder="John Doe"
                                        value={name}
                                        onChangeText={setName}
                                        borderWidth={1}
                                        borderColor="$gray9"
                                        backgroundColor="$gray6"
                                        placeholderTextColor="$gray12"
                                        color="$color"
                                    />
                                </YStack>

                                <YStack gap="$2">
                                    <Label htmlFor="email" color="$color">Email</Label>
                                    <Input
                                        id="email"
                                        size="$4"
                                        placeholder="hello@example.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        borderWidth={1}
                                        borderColor="$gray9"
                                        backgroundColor="$gray6"
                                        placeholderTextColor="$gray12"
                                        color="$color"
                                    />
                                </YStack>

                                <YStack gap="$2">
                                    <Label htmlFor="password" color="$color">Password</Label>
                                    <Input
                                        id="password"
                                        size="$4"
                                        secureTextEntry
                                        placeholder="••••••••"
                                        value={password}
                                        onChangeText={setPassword}
                                        borderWidth={1}
                                        borderColor="$gray9"
                                        backgroundColor="$gray6"
                                        placeholderTextColor="$gray12"
                                        color="$color"
                                    />
                                </YStack>

                                {!!error && <Paragraph color="$red10" textAlign="center">{error}</Paragraph>}

                                <Button
                                    size="$5"
                                    onPress={handleSignup}
                                    icon={loading ? <Spinner /> : undefined}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </Form>

                            <XStack justifyContent="center" gap="$2">
                                <Paragraph color="$color10" size="$2">Already have an account?</Paragraph>
                                <Paragraph
                                    color="$blue10"
                                    size="$2"
                                    fontWeight="700"
                                    onPress={() => router.push('/login')}
                                    cursor="pointer"
                                >
                                    Sign In
                                </Paragraph>
                            </XStack>
                        </YStack>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </YStack>
    )
}
