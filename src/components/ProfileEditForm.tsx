"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface Profile {
  name: string;
  age: number;
  gender: string;
  location: string;
  about?: string;
}

interface ProfileEditFormProps {
  initialProfile: Profile;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
}

export function ProfileEditForm({ initialProfile, onSave, onCancel }: ProfileEditFormProps) {
  const [formState, setFormState] = useState<Profile>(initialProfile);
  const [hasError, setHasError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormState({
      ...formState,
      [e.target.name]: e.target.name === "age" ? Number(e.target.value) : e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setHasError("");
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("認証情報がありません");
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formState),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "更新に失敗しました");
      onSave(data.profile);
    } catch (err) {
      setHasError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {hasError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{hasError}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">お名前</label>
        <input
          name="name"
          type="text"
          required
          value={formState.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">年齢</label>
        <input
          name="age"
          type="number"
          min={18}
          max={100}
          required
          value={formState.age}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">性別</label>
        <select
          name="gender"
          required
          value={formState.gender}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">居住地</label>
        <input
          name="location"
          type="text"
          required
          value={formState.location}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">自己紹介</label>
        <textarea
          name="about"
          rows={3}
          value={formState.about || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 disabled:opacity-50"
        >
          {isLoading ? "保存中..." : "保存"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
} 