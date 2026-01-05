import { useConversation } from "@elevenlabs/react-native";
import { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Analytics } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";

import { ConnectButton } from "./ConnectButton";
import { SessionControls } from "./SessionControls";

interface Transcription {
  id: string;
  text: string;
  role: "user" | "agent";
  timestamp: number;
}

interface ChatProps {
  lessonInstruction?: string;
  targetLanguage?: string;
  nativeLanguage?: string;
}

export function Chat({ lessonInstruction, targetLanguage, nativeLanguage }: ChatProps) {
  const [isChatRunning, setIsChatRunning] = useState(false);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isHandlingSessionEnd, setIsHandlingSessionEnd] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      setIsChatRunning(true);
      setSessionStartTime(new Date());
      if (targetLanguage) {
        Analytics.lessonStarted({ language: targetLanguage });
      }
    },
    onDisconnect: () => {
      setIsChatRunning(false);
    },
    onMessage: (message) => {
      const newTranscription: Transcription = {
        id: `${Date.now()}-${Math.random()}`,
        text: message.message,
        role: message.source === "user" ? "user" : "agent",
        timestamp: Date.now(),
      };
      setTranscriptions((prev) => [...prev, newTranscription]);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: t("chat.errors.agentUnavailable.title"),
        description: t("chat.errors.agentUnavailable.description"),
        variant: "destructive",
      });
    },
  });

  const handleSessionEnd = useCallback(async () => {
    if (!sessionStartTime || !user || isHandlingSessionEnd) {
      return;
    }

    setIsHandlingSessionEnd(true);

    const currentSessionStartTime = sessionStartTime;
    setSessionStartTime(null);

    const sessionEndTime = new Date();
    const sessionDurationMinutes = Math.ceil(
      (sessionEndTime.getTime() - currentSessionStartTime.getTime()) / (1000 * 60)
    );

    if (sessionDurationMinutes < 1) {
      setIsHandlingSessionEnd(false);
      return;
    }

    try {
      await Promise.all([
        supabase
          .from("lesson")
          .insert({
            user: user.id,
            transcript: JSON.stringify(transcriptions),
            created_at: new Date().toISOString(),
          })
          .throwOnError(),

        supabase.rpc("increment_credits", { increment_amount: -sessionDurationMinutes }).throwOnError(),

        supabase.rpc("update_user_streak", {
          p_user_id: user.id,
          p_minutes: sessionDurationMinutes,
        }),
      ]);

      if (targetLanguage) {
        Analytics.lessonCompleted({
          language: targetLanguage,
          durationMinutes: sessionDurationMinutes,
        });
      }
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        title: t("chat.errors.sessionSave.title"),
        description: t("chat.errors.sessionSave.description"),
        variant: "destructive",
      });
    } finally {
      setIsHandlingSessionEnd(false);
    }
  }, [sessionStartTime, user, isHandlingSessionEnd, transcriptions, t, toast, targetLanguage]);

  useEffect(() => {
    if (!isChatRunning && sessionStartTime) {
      void handleSessionEnd();
    }
  }, [isChatRunning, sessionStartTime, handleSessionEnd]);

  const requestMicrophonePermission = async (): Promise<boolean> => {
    const permission =
      Platform.OS === "ios" ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.DENIED) {
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    }

    return false;
  };

  const handleConnect = async () => {
    const agentId = process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID;
    if (!agentId) {
      toast({
        title: t("chat.errors.agentUnavailable.title"),
        description: "Agent ID not configured",
        variant: "destructive",
      });
      return;
    }

    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        toast({
          title: t("chat.errors.microphonePermission.title"),
          description: t("chat.errors.microphonePermission.description"),
          variant: "destructive",
        });
        return;
      }

      setTranscriptions([]);

      const sessionConfig: {
        agentId: string;
        overrides?: {
          agent?: {
            prompt?: { prompt: string };
            language?: string;
            firstMessage?: string;
          };
        };
        dynamicVariables?: Record<string, string>;
      } = {
        agentId,
      };

      if (lessonInstruction || targetLanguage) {
        sessionConfig.overrides = {
          agent: {},
        };

        if (lessonInstruction) {
          sessionConfig.overrides.agent!.prompt = {
            prompt: lessonInstruction,
          };
        }

        if (targetLanguage) {
          sessionConfig.overrides.agent!.language = targetLanguage;
          const greeting =
            nativeLanguage === "English"
              ? `Hello! Let's start your ${targetLanguage} lesson. Are you ready?`
              : `Let's begin your ${targetLanguage} lesson!`;
          sessionConfig.overrides.agent!.firstMessage = greeting;
        }
      }

      if (user?.id || targetLanguage) {
        sessionConfig.dynamicVariables = {};
        if (user?.id) {
          sessionConfig.dynamicVariables.user_id = user.id;
        }
        if (targetLanguage) {
          sessionConfig.dynamicVariables.target_language = targetLanguage;
        }
      }

      await conversation.startSession(sessionConfig);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: t("chat.errors.agentUnavailable.title"),
        description: t("chat.errors.agentUnavailable.description"),
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    await handleSessionEnd();
    await conversation.endSession();
  };

  return (
    <View style={styles.container}>
      <View style={styles.visualizerContainer}>
        {isChatRunning && <AudioVisualizer isSpeaking={conversation.isSpeaking} />}
      </View>

      <View style={styles.controlsContainer}>
        {isChatRunning ? (
          <SessionControls onDisconnect={handleDisconnect} />
        ) : (
          <ConnectButton
            onConnect={handleConnect}
            isConnecting={conversation.status === "connecting"}
          />
        )}
      </View>
    </View>
  );
}

interface AudioVisualizerProps {
  isSpeaking: boolean;
}

function AudioVisualizer({ isSpeaking }: AudioVisualizerProps) {
  const bars = [0, 1, 2, 3, 4];

  return (
    <View style={styles.visualizer}>
      {bars.map((index) => (
        <VisualizerBar key={index} index={index} isSpeaking={isSpeaking} />
      ))}
    </View>
  );
}

interface VisualizerBarProps {
  index: number;
  isSpeaking: boolean;
}

function VisualizerBar({ index, isSpeaking }: VisualizerBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    if (isSpeaking) {
      return {
        height: withRepeat(
          withSequence(
            withSpring(40 + Math.random() * 60, { damping: 10 }),
            withSpring(20 + Math.random() * 40, { damping: 10 })
          ),
          -1,
          true
        ),
      };
    }
    return {
      height: withSpring(20, { damping: 15 }),
    };
  }, [isSpeaking]);

  return (
    <Animated.View
      style={[
        styles.visualizerBar,
        { animationDelay: `${index * 100}ms` },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  visualizerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  visualizer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  visualizerBar: {
    width: 12,
    backgroundColor: "#8B4513",
    borderRadius: 6,
  },
  controlsContainer: {
    paddingBottom: 40,
  },
});
