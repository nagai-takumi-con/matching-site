"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  about?: string;
  userId: string;
}

const genderMap: Record<string, string> = {
  male: "男性",
  female: "女性",
  other: "その他",
};

interface LikeStatusMap {
  [id: string]: string;
}

interface LikedMap {
  [id: string]: boolean;
}

interface FormState {
  ageMin: string;
  ageMax: string;
  gender: string;
  location: string;
}

export function ProfileSearch() {
  const [formState, setFormState] = useState<FormState>({
    ageMin: "",
    ageMax: "",
    gender: "",
    location: "",
  });
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState("");
  const [likedMap, setLikedMap] = useState<LikedMap>({});
  const [likeStatusMap, setLikeStatusMap] = useState<LikeStatusMap>({});
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);
  const [showMessageFormUserId, setShowMessageFormUserId] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setHasError("");
    setProfiles([]);
    try {
      const params = new URLSearchParams();
      if (formState.ageMin) params.append("ageMin", formState.ageMin);
      if (formState.ageMax) params.append("ageMax", formState.ageMax);
      if (formState.gender) params.append("gender", formState.gender);
      if (formState.location) params.append("location", formState.location);
      const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userData) {
        const user = JSON.parse(userData);
        if (user.id) params.append("excludeUserId", user.id);
      }
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "検索に失敗しました");
      setProfiles(data);
    } catch (err) {
      setHasError(err instanceof Error ? err.message : "検索に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLike(profileId: string, receiverId: string) {
    setLikeStatusMap((prev) => ({ ...prev, [profileId]: "" }));
    const token = localStorage.getItem("token");
    if (!token) {
      setLikeStatusMap((prev) => ({ ...prev, [profileId]: "ログインしてください" }));
      return;
    }
    try {
      const res = await fetch("/api/like/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "いいねに失敗しました");
      setLikedMap((prev) => ({ ...prev, [profileId]: true }));
      setLikeStatusMap((prev) => ({ ...prev, [profileId]: "いいねしました！" }));
    } catch (err) {
      setLikeStatusMap((prev) => ({ ...prev, [profileId]: err instanceof Error ? err.message : "いいねに失敗しました" }));
    }
  }

  function handleDetail(profile: Profile) {
    setDetailProfile(profile);
    setShowMessageFormUserId(null);
    setMessageContent("");
    setMessageStatus("");
  }

  function closeDetail() {
    setDetailProfile(null);
  }

  function openMessageForm(userId: string) {
    setShowMessageFormUserId(userId);
    setMessageContent("");
    setMessageStatus("");
  }

  async function sendMessage(receiverId: string) {
    setMessageStatus("");
    const token = localStorage.getItem("token");
    if (!token) {
      setMessageStatus("ログインしてください");
      return;
    }
    if (!messageContent.trim()) {
      setMessageStatus("メッセージを入力してください");
      return;
    }
    try {
      const res = await fetch("/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId, content: messageContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "送信に失敗しました");
      setMessageStatus("メッセージを送信しました！");
      setMessageContent("");
    } catch (err) {
      setMessageStatus(err instanceof Error ? err.message : "送信に失敗しました");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">相手を検索</h2>
      <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4" onSubmit={handleSearch}>
        <div>
          <label className="block text-sm font-medium text-gray-700">年齢（下限）</label>
          <input
            type="number"
            name="ageMin"
            min={18}
            max={100}
            value={formState.ageMin}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">年齢（上限）</label>
          <input
            type="number"
            name="ageMax"
            min={18}
            max={100}
            value={formState.ageMax}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">性別</label>
          <select
            name="gender"
            value={formState.gender}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">指定なし</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">居住地</label>
          <input
            type="text"
            name="location"
            value={formState.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div className="md:col-span-4 flex justify-end items-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 disabled:opacity-50"
          >
            {isLoading ? "検索中..." : "検索"}
          </button>
        </div>
      </form>
      {hasError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{hasError}</div>}
      <div>
        {profiles.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <li key={profile.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-lg text-pink-700">{profile.name}</div>
                  <div className="text-gray-600 text-sm">{profile.age}歳 / {genderMap[profile.gender] || ""} / {profile.location}</div>
                  {profile.about && <div className="text-gray-500 text-sm mt-1">{profile.about}</div>}
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    className={`px-4 py-1 rounded-md text-sm font-medium ${likedMap[profile.id] ? "bg-gray-300 text-gray-500" : "bg-pink-500 text-white hover:bg-pink-600"}`}
                    disabled={likedMap[profile.id]}
                    onClick={() => handleLike(profile.id, profile.userId)}
                  >
                    {likedMap[profile.id] ? "いいね済" : "いいね"}
                  </button>
                  {likeStatusMap[profile.id] && <span className="text-xs text-pink-600">{likeStatusMap[profile.id]}</span>}
                  <button
                    className="px-4 py-1 rounded-md text-sm font-medium bg-white border border-pink-400 text-pink-600 hover:bg-pink-50"
                    onClick={() => handleDetail(profile)}
                  >
                    詳細
                  </button>
                  <button
                    className="px-4 py-1 rounded-md text-sm font-medium bg-white border border-blue-400 text-blue-600 hover:bg-blue-50"
                    onClick={() => openMessageForm(profile.userId)}
                  >
                    メッセージ
                  </button>
                </div>
                {showMessageFormUserId === profile.userId && (
                  <div className="mt-2 w-full md:w-1/2">
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      value={messageContent}
                      onChange={e => setMessageContent(e.target.value)}
                      placeholder="メッセージを入力..."
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                        onClick={() => sendMessage(profile.userId)}
                        type="button"
                      >
                        送信
                      </button>
                      <button
                        className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-400"
                        onClick={() => setShowMessageFormUserId(null)}
                        type="button"
                      >
                        キャンセル
                      </button>
                    </div>
                    {messageStatus && <div className="text-sm mt-1 text-blue-600">{messageStatus}</div>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-center">検索結果がありません</div>
        )}
      </div>
      {detailProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-pink-600 text-2xl font-bold"
              onClick={closeDetail}
              aria-label="閉じる"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-pink-700 mb-4 text-center">プロフィール詳細</h3>
            <div className="space-y-3">
              <div><span className="font-semibold text-gray-700">お名前：</span>{detailProfile.name}</div>
              <div><span className="font-semibold text-gray-700">年齢：</span>{detailProfile.age}歳</div>
              <div><span className="font-semibold text-gray-700">性別：</span>{genderMap[detailProfile.gender] || ""}</div>
              <div><span className="font-semibold text-gray-700">居住地：</span>{detailProfile.location}</div>
              <div><span className="font-semibold text-gray-700">自己紹介：</span>{detailProfile.about ? detailProfile.about : "未入力"}</div>
            </div>
            <div className="mt-6">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                onClick={() => openMessageForm(detailProfile.userId)}
                type="button"
              >
                メッセージを送る
              </button>
              {showMessageFormUserId === detailProfile.userId && (
                <div className="mt-2">
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={messageContent}
                    onChange={e => setMessageContent(e.target.value)}
                    placeholder="メッセージを入力..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                      onClick={() => sendMessage(detailProfile.userId)}
                      type="button"
                    >
                      送信
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-400"
                      onClick={() => setShowMessageFormUserId(null)}
                      type="button"
                    >
                      キャンセル
                    </button>
                  </div>
                  {messageStatus && <div className="text-sm mt-1 text-blue-600">{messageStatus}</div>}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
                onClick={closeDetail}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 