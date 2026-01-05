import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "./ui/Button";

interface SessionControlsProps {
  onDisconnect: () => void;
}

export function SessionControls({ onDisconnect }: SessionControlsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Button onPress={onDisconnect} variant="destructive" size="lg" style={styles.button}>
        {t("lesson.endLesson")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  button: {
    minWidth: 200,
  },
});
