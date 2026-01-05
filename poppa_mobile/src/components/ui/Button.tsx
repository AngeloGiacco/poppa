import { forwardRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";

type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends Omit<PressableProps, "style"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: "#8B4513" },
    text: { color: "#FFFFFF" },
  },
  destructive: {
    container: { backgroundColor: "#DC2626" },
    text: { color: "#FFFFFF" },
  },
  outline: {
    container: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#D1D5DB" },
    text: { color: "#1F2937" },
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    text: { color: "#1F2937" },
  },
  link: {
    container: { backgroundColor: "transparent" },
    text: { color: "#8B4513", textDecorationLine: "underline" },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
    text: { fontSize: 16 },
  },
  sm: {
    container: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
    text: { fontSize: 14 },
  },
  lg: {
    container: { paddingHorizontal: 24, paddingVertical: 16, borderRadius: 10 },
    text: { fontSize: 18 },
  },
  icon: {
    container: { padding: 12, borderRadius: 8, aspectRatio: 1 },
    text: { fontSize: 16 },
  },
};

export const Button = forwardRef<typeof Pressable, ButtonProps>(
  (
    { variant = "default", size = "default", isLoading = false, children, style, textStyle, disabled, ...props },
    _ref
  ) => {
    const variantStyle = variantStyles[variant];
    const sizingStyle = sizeStyles[size];

    return (
      <Pressable
        disabled={disabled || isLoading}
        style={({ pressed }) => [
          {
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            opacity: disabled || isLoading ? 0.5 : pressed ? 0.8 : 1,
          },
          variantStyle.container,
          sizingStyle.container,
          style,
        ]}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variantStyle.text.color}
            size="small"
            style={{ marginRight: typeof children === "string" ? 8 : 0 }}
          />
        ) : null}
        {typeof children === "string" ? (
          <Text
            style={[
              { fontWeight: "600", textAlign: "center" },
              variantStyle.text,
              sizingStyle.text,
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

Button.displayName = "Button";
