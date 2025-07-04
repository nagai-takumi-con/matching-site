"use client";
import { useEffect, useState } from "react";

interface MatchSender {
  id: string;
  email: string;
  profile: { name: string } | null;
}
interface MatchItem {
  id: string;
  sender: MatchSender | null;
}

export function LikesInbox() {
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState("");

  useEffect(() => {
    async function fetchLikes() {
      setIsLoading(true);
      setHasError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("ログインしてください");
        const res = await fetch("/api/like/inbox", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "取得に失敗しました");
        setLikeCount(data.count);
        setMatches(data.matches || []);
      } catch (err) {
        setHasError(err instanceof Error ? err.message : "取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchLikes();
  }, []);

  async function handleAction(matchId: string, action: 'accept' | 'reject') {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("ログインしてください");
      const res = await fetch("/api/like/inbox", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ matchId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "更新に失敗しました");
      // 承認・拒否後はリストを再取得
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      setLikeCount((prev) => (prev !== null ? prev - 1 : null));
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新に失敗しました");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">もらったいいね</h2>
      {isLoading ? (
        <div className="text-gray-500">読み込み中...</div>
      ) : hasError ? (
        <div className="text-red-600">{hasError}</div>
      ) : (
        <>
          <div className="text-2xl text-pink-600 font-bold mb-4">{likeCount} 件</div>
          {matches.length === 0 ? (
            <div className="text-gray-500">新しいいいねはありません</div>
          ) : (
            <ul className="space-y-4">
              {matches.map((match) => (
                <li key={match.id} className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg shadow">
                  <div className="flex-1">
                    <div className="font-bold text-pink-700">{match.sender?.profile?.name || match.sender?.email || "不明"}</div>
                    <div className="text-xs text-gray-500">{match.sender?.email}</div>
                  </div>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                    onClick={() => handleAction(match.id, 'accept')}
                  >承認</button>
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={() => handleAction(match.id, 'reject')}
                  >拒否</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
} 