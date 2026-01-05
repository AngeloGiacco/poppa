import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/lib/supabase";
import { interface_locales } from "@/lib/supportedLanguages";
import type { OnboardingStackParamList } from "@/navigation/types";

export function NativeLanguageSelectScreen() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedLanguage || !user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ native_language: selectedLanguage })
        .eq("id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save your preference. Please try again.",
          variant: "destructive",
        });
      } else {
        await refreshProfile();
        navigation.navigate("TargetLanguageSelect");
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("onboarding.selectNativeLanguage")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {interface_locales.map((language) => (
          <Pressable
            key={language.locale}
            style={[
              styles.languageItem,
              selectedLanguage === language.name && styles.languageItemSelected,
            ]}
            onPress={() => setSelectedLanguage(language.name)}
          >
            <Text style={styles.languageEmoji}>{getLanguageEmoji(language.code)}</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNative}>{language.native_name}</Text>
            </View>
            {selectedLanguage === language.name && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={handleContinue}
          disabled={!selectedLanguage}
          isLoading={isLoading}
          style={styles.continueButton}
        >
          {t("common.continue")}
        </Button>
      </View>
    </SafeAreaView>
  );
}

function getLanguageEmoji(code: string): string {
  const emojiMap: Record<string, string> = {
    US: "🇺🇸",
    CN: "🇨🇳",
    ES: "🇪🇸",
    IN: "🇮🇳",
    PT: "🇵🇹",
    BR: "🇧🇷",
    FR: "🇫🇷",
    DE: "🇩🇪",
    JP: "🇯🇵",
    AE: "🇦🇪",
    RU: "🇷🇺",
    KR: "🇰🇷",
    ID: "🇮🇩",
    IT: "🇮🇹",
    NL: "🇳🇱",
    TR: "🇹🇷",
    PL: "🇵🇱",
    SE: "🇸🇪",
  };
  return emojiMap[code] || "🌍";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  languageItemSelected: {
    backgroundColor: "#FEF3C7",
    borderWidth: 2,
    borderColor: "#8B4513",
  },
  languageEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  languageNative: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    color: "#8B4513",
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  continueButton: {
    width: "100%",
  },
});
