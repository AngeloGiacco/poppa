"use client";

import { Chat } from "@/components/Chat";

interface RoomComponentProps {
  instruction: string;
}

export function RoomComponent({ instruction }: RoomComponentProps) {
  return (
    <div className="min-h-[500px] p-4">
      <Chat />
    </div>
  );
}
