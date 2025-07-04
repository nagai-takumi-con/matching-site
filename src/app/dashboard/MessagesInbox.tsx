"use client";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    email: string;
    profile: { name: string } | null;
  };
}

export function MessagesInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      setIsLoading(true);
      setHasError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("ログインしてください");
        const res = await fetch("/api/message/inbox", {
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
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">受信メッセージ</h2>
      {isLoading ? (
        <div className="text-gray-500">読み込み中...</div>
      ) : hasError ? (
        <div className="text-red-600">{hasError}</div>
      ) : messages.length === 0 ? (
        <div className="text-gray-500">メッセージはありません</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <li key={msg.id} className="py-4">
              <div className="text-gray-800 mb-1">{msg.content}</div>
              <div className="text-sm text-gray-500">
                <span>送信者: {msg.sender?.profile?.name || msg.sender?.email || "不明"}</span>
                <span className="ml-4">{new Date(msg.createdAt).toLocaleString("ja-JP", { dateStyle: "short", timeStyle: "short" })}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 