import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { learnable_languages } from "@/lib/supportedLanguages";
import type { MainStackParamList } from "@/navigation/types";

export function DashboardScreen() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleStartLesson = (languageCode: string, languageName: string) => {
    navigation.navigate("Lesson", { languageCode, languageName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            {t("dashboard.welcome")}, {userProfile?.first_name || "Learner"}!
          </Text>
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile?.first_name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          </Pressable>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile?.credits ?? 0}</Text>
              <Text style={styles.statLabel}>{t("dashboard.credits")}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>{t("dashboard.stats.streak")}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>{t("dashboard.stats.totalLessons")}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("dashboard.learningLanguages")}</Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => navigation.navigate("LanguageSelect")}
            >
              {t("dashboard.addLanguage")}
            </Button>
          </View>

          <View style={styles.languageGrid}>
            {learnable_languages.slice(0, 4).map((language) => (
              <Pressable
                key={language.code}
                style={styles.languageCard}
                onPress={() => handleStartLesson(language.code, language.name)}
              >
                <Text style={styles.languageEmoji}>
                  {getLanguageEmoji(language.code)}
                </Text>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageNative}>{language.native_name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.startLesson")}</Text>
          <Card style={styles.quickStartCard}>
            <Text style={styles.quickStartText}>
              Ready to practice? Choose a language above or tap below to start a quick lesson.
            </Text>
            <Button
              onPress={() => handleStartLesson("ES", "Spanish")}
              style={styles.quickStartButton}
            >
              {t("dashboard.continueLesson")}
            </Button>
          </Card>
        </View>
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
  };
  return emojiMap[code] || "🌍";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8B4513",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  statsCard: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8B4513",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  languageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "47%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
  languageNative: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  quickStartCard: {
    alignItems: "center",
  },
  quickStartText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  quickStartButton: {
    minWidth: 200,
  },
});
