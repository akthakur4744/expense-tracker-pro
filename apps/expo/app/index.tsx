import { HomeScreen } from 'app/features/home/screen'
import { Stack, useRouter } from 'expo-router'
import { View } from 'react-native'

export default function Screen() {
  const router = useRouter()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerShown: false
        }}
      />
      <View style={{ flex: 1 }}>
        <HomeScreen />
      </View>
    </>
  )
}
