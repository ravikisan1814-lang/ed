"use client";

import BackButton from "@/components/BackButton";
import ChatInterface from "@/components/ChatInterface";
import ChatShell from "@/components/page-shells/ChatShell";

export default function ChatPage() {
  return (
    <ChatShell>
      <div className="chat-page">
        <ChatInterface />
      </div>
    </ChatShell>
  );
}
