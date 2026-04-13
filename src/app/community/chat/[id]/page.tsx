"use client";
import { use, useEffect, useState, useRef } from "react";
import { getMessages } from "@/lib/data";
import BackHeader from "@/components/shared/BackHeader";

interface Message {
  _id: string;
  content: string;
  Created_Date: string;
  sender_name?: string;
  is_mine?: boolean;
}

const demoMessages: Message[] = [
  {
    _id: "1",
    content: "Hey! How are you feeling this week?",
    Created_Date: new Date(Date.now() - 3600000 * 2).toISOString(),
    sender_name: "Julia",
    is_mine: false,
  },
  {
    _id: "2",
    content: "So much better! Week 12 energy is real 😊",
    Created_Date: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    sender_name: "You",
    is_mine: true,
  },
  {
    _id: "3",
    content: "Did you try the prenatal yoga I recommended?",
    Created_Date: new Date(Date.now() - 3600000).toISOString(),
    sender_name: "Julia",
    is_mine: false,
  },
  {
    _id: "4",
    content: "Yes! Loved it. My back pain is so much better already.",
    Created_Date: new Date(Date.now() - 1800000).toISOString(),
    sender_name: "You",
    is_mine: true,
  },
];

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages(id)
      .then((data) => {
        if (data?.length) setMessages(data);
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      {
        _id: Date.now().toString(),
        content: text,
        Created_Date: new Date().toISOString(),
        sender_name: "You",
        is_mine: true,
      },
    ]);
    setText("");
  }

  return (
    <div className="flex flex-col h-screen bg-cream">
      <BackHeader href="/community" />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-3 pb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.is_mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                msg.is_mine
                  ? "bg-gold text-white rounded-tr-sm"
                  : "bg-white border border-border text-charcoal rounded-tl-sm"
              }`}
            >
              {!msg.is_mine && (
                <p className="text-xs font-medium mb-0.5 opacity-60">
                  {msg.sender_name}
                </p>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border px-4 py-3">
        <div className="flex gap-2 items-center">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            className="flex-1 text-sm bg-cream rounded-pill px-4 py-2.5 outline-none placeholder-muted"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="w-9 h-9 bg-gold rounded-full flex items-center justify-center disabled:opacity-50 flex-shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
