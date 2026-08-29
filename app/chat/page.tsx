"use client";

import BackButton from "@/components/BackButton";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="chat-page-wrapper">
      <BackButton href="/" />
      <section className="chat-page">
        <ChatInterface />
      </section>
    </div>
  );
}
