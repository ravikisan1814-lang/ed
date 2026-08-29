"use client";

import BackButton from "@/components/BackButton";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="chat-page-wrapper">
      <BackButton href="/" label="Back to Home" />
      <section className="chat-page">
        <ChatInterface />
      </section>
    </div>
  );
}
