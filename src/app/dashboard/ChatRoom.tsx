"use client";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle, FaArrowLeft, FaRegCheckCircle } from "react-icons/fa";
import Image from "next/image";

interface ChatPartner {
  id: string;
  email: string;
  profile: {
    name: string;
    age: number;
    gender: string;
    location: string;
    about?: string;
    photos?: string;
  };
}

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface ChatRoomProps {
  currentUserId: string;
  partner: ChatPartner;
  onBack: () => void;
  onProfileLink: (partner: ChatPartner) => void;
}

export function ChatRoom({ currentUserId, partner, onBack, onProfileLink }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMessages() {
      setIsLoading(true);
      setHasError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("ログインしてください");
        const res = await fetch(`/api/message/room?partnerId=${partner.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "取得に失敗しました");
        setMessages(data);
      } catch (err) {
        setHasError(err instanceof Error ? err.message : "取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, [partner.id, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    setIsLoading(true);
    setHasError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("ログインしてください");
      const res = await fetch("/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: partner.id, content: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "送信に失敗しました");
      setInput("");
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      setHasError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[60vh]">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-pink-100">
          <FaArrowLeft className="text-pink-500 text-xl" />
        </button>
        {partner.profile.photos ? (
          <Image
            src={JSON.parse(partner.profile.photos)[0]}
            alt={partner.profile.name}
            width={40}
            height={40}
            className="rounded-full object-cover border-2 border-pink-300"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 text-gray-300" />
        )}
        <span className="font-bold text-pink-600 text-lg">{partner.profile.name}</span>
        <button
          className="ml-auto px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          onClick={() => onProfileLink(partner)}
        >
          プロフィールを見る
        </button>
      </div>
      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto space-y-2 px-1 pb-2">
        {isLoading ? (
          <div className="text-gray-400 text-center mt-8">読み込み中...</div>
        ) : hasError ? (
          <div className="text-red-600 text-center mt-8">{hasError}</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-8">まだメッセージはありません</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm break-words relative ${
                  msg.senderId === currentUserId
                    ? "bg-gradient-to-r from-pink-400 to-blue-400 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {msg.content}
                {msg.isRead && msg.senderId === currentUserId && (
                  <FaRegCheckCircle className="inline-block ml-2 text-xs text-blue-200 align-text-bottom" title="既読" />
                )}
                <span className="block text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* 入力欄 */}
      <form
        className="flex items-center gap-2 mt-4"
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none shadow"
          placeholder="メッセージを入力..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-400 to-blue-400 text-white px-6 py-2 rounded-full font-bold shadow hover:from-pink-500 hover:to-blue-500 transition-all disabled:opacity-50"
          disabled={isLoading || !input.trim()}
        >
          送信
        </button>
      </form>
    </div>
  );
} 