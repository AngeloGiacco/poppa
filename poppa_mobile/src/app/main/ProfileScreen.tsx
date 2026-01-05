import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export function ProfileScreen() {
  const { t } = useTranslation();
  const { userProfile, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>{t("profile.title")}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile?.first_name?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("profile.nativeLanguage")}</Text>
            <Text style={styles.infoValue}>{userProfile?.native_language || "Not set"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("dashboard.credits")}</Text>
            <Text style={styles.infoValue}>{userProfile?.credits ?? 0}</Text>
          </View>
        </Card>

        <View style={styles.menuSection}>
          <MenuItem label={t("profile.subscription")} onPress={() => {}} />
          <MenuItem label={t("profile.notifications")} onPress={() => {}} />
          <MenuItem label={t("profile.privacy")} onPress={() => {}} />
          <MenuItem label={t("profile.terms")} onPress={() => {}} />
        </View>

        <View style={styles.footer}>
          <Button variant="destructive" onPress={handleLogout} style={styles.logoutButton}>
            {t("auth.logout")}
          </Button>
          <Text style={styles.version}>{t("profile.version")} 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuItemProps {
  label: string;
  onPress: () => void;
}

function MenuItem({ label, onPress }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuItemText}>{label}</Text>
      <Text style={styles.menuItemArrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#8B4513",
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8B4513",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "600",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  infoCard: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuItemText: {
    fontSize: 16,
    color: "#1F2937",
  },
  menuItemArrow: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  logoutButton: {
    minWidth: 200,
    marginBottom: 16,
  },
  version: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
