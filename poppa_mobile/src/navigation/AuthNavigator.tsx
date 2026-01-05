import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ForgotPasswordScreen } from "@/app/auth/ForgotPasswordScreen";
import { LoginScreen } from "@/app/auth/LoginScreen";
import { SignupScreen } from "@/app/auth/SignupScreen";

import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
