"use client";

import { useState, useEffect, useCallback } from "react";

import { useConversation } from "@elevenlabs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import { ConnectButton } from "@/components/connect-button";
import { SessionControls } from "@/components/session-controls";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabaseBrowserClient } from "@/lib/supabase-browser";

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
  const t = useTranslations("Chat");
  const { user } = useAuth();
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isHandlingSessionEnd, setIsHandlingSessionEnd] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      setIsChatRunning(true);
      setSessionStartTime(new Date());
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
        title: t("errors.agentUnavailable.title"),
        description: t("errors.agentUnavailable.description"),
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
        supabaseBrowserClient
          .from("lesson")
          .insert({
            user: user.id,
            transcript: JSON.stringify(transcriptions),
            created_at: new Date().toISOString(),
          })
          .throwOnError(),

        supabaseBrowserClient
          .rpc("increment_credits", { increment_amount: -sessionDurationMinutes })
          .throwOnError(),
      ]);
    } catch (error) {
      console.error("Error saving session:", error);
      if (document.visibilityState === "visible") {
        toast({
          title: t("errors.sessionSave.title"),
          description: t("errors.sessionSave.description"),
          variant: "destructive",
        });
      }
    } finally {
      setIsHandlingSessionEnd(false);
    }
  }, [sessionStartTime, user, isHandlingSessionEnd, transcriptions, t]);

  useEffect(() => {
    if (!isChatRunning && sessionStartTime) {
      handleSessionEnd();
    }
  }, [isChatRunning, sessionStartTime, handleSessionEnd]);

  const handleConnect = async () => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    if (!agentId) {
      toast({
        title: t("errors.agentUnavailable.title"),
        description: "Agent ID not configured",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
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
        title: t("errors.agentUnavailable.title"),
        description: t("errors.agentUnavailable.description"),
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    await handleSessionEnd();
    await conversation.endSession();
  };

  const renderVisualizer = () => (
    <div className="flex w-full items-center">
      <div className="mt-16 flex h-[320px] w-full items-center justify-center md:mt-0 lg:pb-24">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 rounded-full bg-[#8B4513] transition-all duration-150 ${
                conversation.isSpeaking ? "animate-pulse" : ""
              }`}
              style={{
                height: conversation.isSpeaking ? `${40 + Math.random() * 60}px` : "20px",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderConnectionControl = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={isChatRunning ? "session-controls" : "connect-button"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}
      >
        {isChatRunning ? (
          <SessionControls onDisconnect={handleDisconnect} />
        ) : (
          <ConnectButton
            onConnect={handleConnect}
            isConnecting={conversation.status === "connecting"}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="flex h-full min-h-[400px] flex-col overflow-hidden p-2 lg:p-4">
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col">
          <div className="flex w-full items-center justify-center">
            <div className="w-full lg:hidden">{isChatRunning && renderVisualizer()}</div>
          </div>
          <div className="flex h-full grow items-center justify-center">
            <div className="hidden w-full lg:block">{isChatRunning && renderVisualizer()}</div>
          </div>
        </div>

        <div className="absolute-center">{renderConnectionControl()}</div>
      </div>
    </div>
  );
}
