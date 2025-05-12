import 'react-native-url-polyfill/auto';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AppNavigator } from "./navigation/AppNavigator"
import { AuthProvider } from "./context/AuthContext"
import { GamesProvider } from "./context/GamesContext"

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GamesProvider>
          <AppNavigator />
        </GamesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
