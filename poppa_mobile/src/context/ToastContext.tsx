import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

interface ToastContextType {
  toast: (options: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [fadeAnim] = useState(() => new Animated.Value(0));

  const toast = useCallback(
    (options: Omit<Toast, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = { ...options, id };

      setToasts((prev) => [...prev, newToast]);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      });
    },
    [fadeAnim]
  );

  const getBackgroundColor = (variant: Toast["variant"]) => {
    switch (variant) {
      case "destructive":
        return "#DC2626";
      case "success":
        return "#16A34A";
      default:
        return "#1F2937";
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((t) => (
          <Animated.View
            key={t.id}
            style={[
              styles.toast,
              { backgroundColor: getBackgroundColor(t.variant), opacity: fadeAnim },
            ]}
          >
            <Text style={styles.title}>{t.title}</Text>
            {t.description && <Text style={styles.description}>{t.description}</Text>}
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    color: "#E5E5E5",
    fontSize: 14,
    marginTop: 4,
  },
});
