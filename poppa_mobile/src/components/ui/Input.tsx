import { forwardRef, useState } from "react";
import {
  TextInput,
  View,
  Text,
  Pressable,
  type TextInputProps,
  type ViewStyle,
  StyleSheet,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, leftIcon, rightIcon, isPassword, secureTextEntry, style, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isSecure = isPassword ? !showPassword : secureTextEntry;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.inputContainer, error && styles.inputError]}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              (rightIcon || isPassword) && styles.inputWithRightIcon,
              style,
            ]}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isSecure}
            autoCapitalize={isPassword ? "none" : props.autoCapitalize}
            autoCorrect={isPassword ? false : props.autoCorrect}
            {...props}
          />
          {isPassword && (
            <Pressable style={styles.iconContainer} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showHideText}>{showPassword ? "Hide" : "Show"}</Text>
            </Pressable>
          )}
          {!isPassword && rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  showHideText: {
    color: "#8B4513",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
  },
});
