import "./global.css";

import { ElevenLabsProvider } from "@elevenlabs/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import "@/i18n";
import { RootNavigator } from "@/navigation/RootNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ElevenLabsProvider options={{ allowMixingWithOthers: true }}>
          <NavigationContainer>
            <AuthProvider>
              <ToastProvider>
                <StatusBar style="auto" />
                <RootNavigator />
              </ToastProvider>
            </AuthProvider>
          </NavigationContainer>
        </ElevenLabsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
