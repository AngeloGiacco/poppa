import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "./ui/Button";

interface ConnectButtonProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export function ConnectButton({ onConnect, isConnecting }: ConnectButtonProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Button
        onPress={onConnect}
        isLoading={isConnecting}
        size="lg"
        style={styles.button}
      >
        {isConnecting ? t("lesson.connecting") : t("lesson.startLesson")}
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
