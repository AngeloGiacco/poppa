"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";
import { Chat } from "@/components/Chat";
import { Transcript } from "@/components/transcript";
import { useConnection } from "@/hooks/use-connection";
import { AgentProvider } from "@/hooks/use-agent";
import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { usePlaygroundState } from "@/hooks/use-playground-state";

interface RoomComponentProps {
  instruction: string;
}

export function RoomComponent({ instruction }: RoomComponentProps) {
  const { shouldConnect, wsUrl, token } = useConnection();
  const { dispatch } = usePlaygroundState();
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dispatch({ type: "SET_INSTRUCTIONS", payload: instruction });
  }, [instruction, dispatch]);

  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={shouldConnect}
      audio={true}
      className="flex flex-col md:grid md:grid-cols-2 flex-grow overflow-hidden border-l border-r border-b rounded-b-md"
      style={{ "--lk-bg": "white" } as React.CSSProperties}
    >
      <AgentProvider>
        <div className="flex flex-col justify-center w-full relative">
          <Chat />
        </div>
        <div className="hidden md:flex flex-col h-full overflow-y-hidden border-l relative">
          <div
            className="h-full overflow-y-auto"
            ref={transcriptContainerRef}
          >
            <Transcript
              scrollContainerRef={transcriptContainerRef}
              scrollButtonRef={scrollButtonRef}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              ref={scrollButtonRef}
              className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors absolute right-4 bottom-4 shadow-md flex items-center"
            >
              <ChevronDown className="mr-1 h-4 w-4" />
              <span className="text-xs pr-1">View latest</span>
            </button>
          </div>
        </div>
        <RoomAudioRenderer />
        <StartAudio label="Click to allow audio playback" />
      </AgentProvider>
    </LiveKitRoom>
  );
}
