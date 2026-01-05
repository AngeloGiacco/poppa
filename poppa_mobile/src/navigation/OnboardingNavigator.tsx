import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NativeLanguageSelectScreen } from "@/app/onboarding/NativeLanguageSelectScreen";
import { TargetLanguageSelectScreen } from "@/app/onboarding/TargetLanguageSelectScreen";

import type { OnboardingStackParamList } from "./types";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name="NativeLanguageSelect" component={NativeLanguageSelectScreen} />
      <Stack.Screen name="TargetLanguageSelect" component={TargetLanguageSelectScreen} />
    </Stack.Navigator>
  );
}
