import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { addLanguage } from "@/lib/api";
import { learnable_languages } from "@/lib/supportedLanguages";

export function TargetLanguageSelectScreen() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!selectedLanguage || !user) return;

    setIsLoading(true);
    try {
      await addLanguage({
        userId: user.id,
        languageCode: selectedLanguage,
      });

      await refreshProfile();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save your language preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("onboarding.selectTargetLanguage")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {learnable_languages.map((language) => (
          <Pressable
            key={`${language.code}-${language.name}`}
            style={[
              styles.languageItem,
              selectedLanguage === language.code && styles.languageItemSelected,
            ]}
            onPress={() => setSelectedLanguage(language.code)}
          >
            <Text style={styles.languageEmoji}>{getLanguageEmoji(language.code)}</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNative}>{language.native_name}</Text>
            </View>
            {selectedLanguage === language.code && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={handleGetStarted}
          disabled={!selectedLanguage}
          isLoading={isLoading}
          style={styles.continueButton}
        >
          {t("onboarding.getStarted")}
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
    IT: "🇮🇹",
    NL: "🇳🇱",
    TR: "🇹🇷",
    PL: "🇵🇱",
    SE: "🇸🇪",
    MY: "🇲🇾",
    RO: "🇷🇴",
    UA: "🇺🇦",
    GR: "🇬🇷",
    CZ: "🇨🇿",
    DK: "🇩🇰",
    FI: "🇫🇮",
    BG: "🇧🇬",
    HR: "🇭🇷",
    SK: "🇸🇰",
    HU: "🇭🇺",
    NO: "🇳🇴",
    VN: "🇻🇳",
    PH: "🇵🇭",
    TH: "🇹🇭",
    IL: "🇮🇱",
    IR: "🇮🇷",
    KE: "🇰🇪",
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
