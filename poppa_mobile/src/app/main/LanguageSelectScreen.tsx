import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { learnable_languages } from "@/lib/supportedLanguages";
import type { MainStackParamList } from "@/navigation/types";

export function LanguageSelectScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleSelectLanguage = (languageCode: string, languageName: string) => {
    navigation.navigate("Lesson", { languageCode, languageName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.title}>{t("dashboard.selectLanguage")}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {learnable_languages.map((language) => (
          <Pressable
            key={`${language.code}-${language.name}`}
            style={styles.languageItem}
            onPress={() => handleSelectLanguage(language.code, language.name)}
          >
            <Text style={styles.languageEmoji}>{getLanguageEmoji(language.code)}</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNative}>{language.native_name}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        ))}
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#6B7280",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    padding: 16,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
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
  arrow: {
    fontSize: 18,
    color: "#9CA3AF",
  },
});
