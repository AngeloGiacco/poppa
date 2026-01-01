"use client";

import { useEffect, useRef } from "react";

import Script from "next/script";

import { useTranslations } from "next-intl";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const ElevenLabsChatPage = () => {
  const { user } = useAuth();
  const t = useTranslations("chat");
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const widgetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const attemptSetDynamicVariables = () => {
      if (user?.id && agentId) {
        const widget = document.querySelector("elevenlabs-convai") as HTMLElement | null;
        if (widget) {
          widget.setAttribute("dynamic-variables", JSON.stringify({ user_id: user.id }));
        }
      }
    };

    if (user?.id) {
      attemptSetDynamicVariables();
    }

    const scriptElement = document.querySelector(
      'script[src="https://elevenlabs.io/convai-widget/index.js"]'
    );
    if (scriptElement) {
      scriptElement.addEventListener("load", attemptSetDynamicVariables);
    }

    return () => {
      if (scriptElement) {
        scriptElement.removeEventListener("load", attemptSetDynamicVariables);
      }
    };
  }, [user, agentId]);

  if (!agentId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{t("error.agentIdMissing")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">{t("title")}</h1>
      <div className="flex justify-center">
        <elevenlabs-convai ref={widgetRef} agent-id={agentId} />
      </div>
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="lazyOnload" async />
    </div>
  );
};

const ProtectedElevenLabsChatPage = () => (
  <ProtectedRoute>
    <ElevenLabsChatPage />
  </ProtectedRoute>
);

export default ProtectedElevenLabsChatPage;
