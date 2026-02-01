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
    Anchor,
    ScrollView
} from '@my/ui'
import { useState, useEffect } from 'react'
import { useRouter } from 'solito/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'app/config/firebase'
import { useAuth } from 'app/provider/AuthProvider'
import { KeyboardAvoidingView, Platform } from 'react-native'

export function LoginScreen() {
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

    const handleLogin = async () => {
        if (!auth) {
            setError("Firebase config missing")
            return
        }
        setLoading(true)
        setError('')
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push('/')
            router.push('/')
        } catch (e: any) {
            setError(getErrorMessage(e.code))
        } finally {
            setLoading(false)
        }
    }

    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Invalid email address.'
            case 'auth/user-disabled':
                return 'This account has been disabled.'
            case 'auth/user-not-found':
                return 'No account found with this email.'
            case 'auth/wrong-password':
                return 'Incorrect password.'
            case 'auth/invalid-credential':
                return 'Invalid credentials. Please check your email and password.'
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.'
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
                            <H3 textAlign="center">Welcome Back</H3>
                            <Paragraph textAlign="center" color="$color10">Sign in to continue</Paragraph>

                            <Form onSubmit={handleLogin} gap="$4">
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
                                    onPress={handleLogin}
                                    icon={loading ? <Spinner /> : undefined}
                                    disabled={loading}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </Form>

                            <XStack justifyContent="center" gap="$2">
                                <Paragraph color="$color10" size="$2">Don't have an account?</Paragraph>
                                <Paragraph
                                    color="$blue10"
                                    size="$2"
                                    fontWeight="700"
                                    onPress={() => router.push('/signup')}
                                    cursor="pointer"
                                >
                                    Sign Up
                                </Paragraph>
                            </XStack>
                        </YStack>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </YStack>
    )
}
