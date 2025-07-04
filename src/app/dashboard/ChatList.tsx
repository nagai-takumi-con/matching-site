"use client";
import { useEffect, useState } from "react";

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

interface ChatMessage {
  id: string;
  content: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender?: ChatPartner;
}

interface ChatListProps {
  onSelect: (partner: ChatPartner) => void;
  currentUserId: string;
}

export function ChatList({ onSelect }: ChatListProps) {
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState("");

  useEffect(() => {
    async function fetchChatList() {
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
        setChatList(data);
      } catch (err) {
        setHasError(err instanceof Error ? err.message : "取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchChatList();
  }, []);

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 mb-8 border border-blue-100 animate-fadeIn">
      <h2 className="text-xl font-bold text-blue-600 mb-4">チャットリスト</h2>
      {isLoading ? (
        <div className="text-gray-500">読み込み中...</div>
      ) : hasError ? (
        <div className="text-red-600">{hasError}</div>
      ) : chatList.length === 0 ? (
        <div className="text-gray-400 text-center">マッチした相手がいません</div>
      ) : (
        <ul className="space-y-3">
          {chatList.map((msg) =>
            msg.sender ? (
              <li
                key={msg.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-blue-50 shadow hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-pink-200 group"
                onClick={() => msg.sender && onSelect(msg.sender)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-pink-600 truncate">{msg.sender.profile?.name || msg.sender.email}</span>
                  </div>
                  <div className="text-gray-600 text-sm truncate">
                    {msg.content}
                  </div>
                </div>
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
} 