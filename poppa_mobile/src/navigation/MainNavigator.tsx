import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DashboardScreen } from "@/app/main/DashboardScreen";
import { LanguageSelectScreen } from "@/app/main/LanguageSelectScreen";
import { LessonScreen } from "@/app/main/LessonScreen";
import { ProfileScreen } from "@/app/main/ProfileScreen";

import type { MainStackParamList } from "./types";

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="LanguageSelect"
        component={LanguageSelectScreen}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
