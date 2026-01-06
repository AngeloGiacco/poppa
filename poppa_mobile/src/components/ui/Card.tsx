import { View, type ViewProps, StyleSheet } from "react-native";

interface CardProps extends ViewProps {
  variant?: "default" | "outlined";
}

export function Card({ variant = "default", style, children, ...props }: CardProps) {
  return (
    <View style={[styles.card, variant === "outlined" && styles.outlined, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  outlined: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
