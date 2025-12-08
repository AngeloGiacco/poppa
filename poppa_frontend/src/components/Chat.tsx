"use client";

import { useState, useEffect, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { SessionControls } from "@/components/session-controls";
import { ConnectButton } from "@/components/connect-button";
import { motion, AnimatePresence } from "framer-motion";
import { ChatControls } from "@/components/chat-controls";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { supabaseBrowserClient } from "@/lib/supabase-browser";
import { useAuth } from "@/context/AuthContext";

interface Transcription {
  id: string;
  text: string;
  role: "user" | "agent";
  timestamp: number;
}

export function Chat() {
  const [isChatRunning, setIsChatRunning] = useState(false);
  const [displayTranscriptions, setDisplayTranscriptions] = useState<Transcription[]>([]);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
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
      setDisplayTranscriptions((prev) => [...prev, newTranscription]);
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
    if (!sessionStartTime || !user || isHandlingSessionEnd) return;

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
          .from('lesson')
          .insert({
            user: user.id,
            transcript: JSON.stringify(displayTranscriptions),
            created_at: new Date().toISOString(),
          })
          .throwOnError(),

        supabaseBrowserClient.rpc(
          'increment_credits',
          { increment_amount: -sessionDurationMinutes }
        ).throwOnError()
      ]);

    } catch (error) {
      console.error('Error saving session:', error);
      if (document.visibilityState === 'visible') {
        toast({
          title: t("errors.sessionSave.title"),
          description: t("errors.sessionSave.description"),
          variant: "destructive",
        });
      }
    } finally {
      setIsHandlingSessionEnd(false);
    }
  }, [sessionStartTime, user, isHandlingSessionEnd, displayTranscriptions, t]);

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
      setDisplayTranscriptions([]);
      await conversation.startSession({ agentId, connectionType: "websocket" as const });
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
      <div className="h-[320px] mt-16 md:mt-0 lg:pb-24 w-full flex items-center justify-center">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 bg-[#8B4513] rounded-full transition-all duration-150 ${
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
          <ConnectButton onConnect={handleConnect} isConnecting={conversation.status === "connecting"} />
        )}
      </motion.div>
    </AnimatePresence>
  );

  const handleToggleEdit = () => {
    setIsEditingInstructions(!isEditingInstructions);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-2 lg:p-4">
      <ChatControls
        showEditButton={isChatRunning}
        isEditingInstructions={isEditingInstructions}
        onToggleEdit={handleToggleEdit}
      />
      <div className="flex flex-col flex-grow items-center justify-center">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-center w-full">
            <div className="lg:hidden w-full">
              {isChatRunning && renderVisualizer()}
            </div>
          </div>
          <div className="grow h-full flex items-center justify-center">
            <div className="w-full hidden lg:block">
              {isChatRunning && renderVisualizer()}
            </div>
          </div>
        </div>

        <div className="absolute-center">
          {renderConnectionControl()}
        </div>
      </div>
    </div>
  );
}
