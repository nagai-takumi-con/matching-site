'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileEditForm } from '@/components/ProfileEditForm';
import { ProfileSearch } from '@/components/ProfileSearch';
import { MessagesInbox } from './MessagesInbox';
import { LikesInbox } from './LikesInbox';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { ChatList } from './ChatList';
import { ChatRoom } from './ChatRoom';

interface User {
  id: string;
  email: string;
  profile: {
    name: string;
    age: number;
    gender: string;
    location: string;
    about?: string;
  };
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedChatPartner, setSelectedChatPartner] = useState<ChatPartner | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<ChatPartner["profile"] | null>(null);

  useEffect(() => {
    // ローカルストレージからユーザー情報を取得
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUser(user);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleEditSave = (profile: User["profile"]) => {
    if (!user) return;
    const updatedUser = { ...user, profile };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white/80 shadow-sm backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <HiOutlineSparkles className="text-pink-500 text-3xl animate-bounce" />
              <h1 className="text-2xl font-extrabold text-pink-600 tracking-tight drop-shadow-sm">婚活マッチング</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-semibold">
                ようこそ、<span className="text-pink-500 font-bold">{user.profile.name}</span>さん
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                <FaSignOutAlt className="inline-block mr-1" /> ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-6 border border-pink-100 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaUserEdit className="text-pink-400" /> プロフィール
              </h2>
              {editing ? (
                <ProfileEditForm
                  initialProfile={user.profile}
                  onSave={handleEditSave}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">お名前:</span>
                      <span className="font-semibold text-lg text-pink-600">{user.profile.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">年齢:</span>
                      <span className="font-semibold">{user.profile.age}歳</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">性別:</span>
                      <span className="font-semibold">
                        {user.profile.gender === 'male' ? '男性' : user.profile.gender === 'female' ? '女性' : 'その他'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">居住地:</span>
                      <span className="font-semibold">{user.profile.location}</span>
                    </div>
                  </div>
                  <button
                    className="mt-6 w-full bg-gradient-to-r from-pink-400 to-blue-400 text-white px-4 py-2 rounded-xl hover:from-pink-500 hover:to-blue-500 shadow-md font-bold flex items-center justify-center gap-2 transition-all duration-150"
                    onClick={() => setEditing(true)}
                  >
                    <FaUserEdit /> プロフィール編集
                  </button>
                </>
              )}
            </div>
            <LikesInbox />
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            <ChatList
              onSelect={partner => setSelectedChatPartner(partner)}
              currentUserId={user.id}
            />
            {selectedChatPartner ? (
              <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100 animate-fadeIn">
                <ChatRoom
                  currentUserId={user.id}
                  partner={selectedChatPartner}
                  onBack={() => setSelectedChatPartner(null)}
                  onProfileLink={partner => setShowProfileModal(partner.profile)}
                />
              </div>
            ) : (
              <>
                <ProfileSearch />
                <MessagesInbox />
              </>
            )}
          </div>
        </div>
      </main>

      {/* プロフィールモーダル */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-pink-600 text-2xl font-bold"
              onClick={() => setShowProfileModal(null)}
              aria-label="閉じる"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-pink-700 mb-4 text-center">プロフィール詳細</h3>
            <div className="space-y-3">
              <div><span className="font-semibold text-gray-700">お名前：</span>{showProfileModal.name}</div>
              <div><span className="font-semibold text-gray-700">年齢：</span>{showProfileModal.age}歳</div>
              <div><span className="font-semibold text-gray-700">性別：</span>{showProfileModal.gender === 'male' ? '男性' : showProfileModal.gender === 'female' ? '女性' : 'その他'}</div>
              <div><span className="font-semibold text-gray-700">居住地：</span>{showProfileModal.location}</div>
              <div><span className="font-semibold text-gray-700">自己紹介：</span>{showProfileModal.about ? showProfileModal.about : "未入力"}</div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
                onClick={() => setShowProfileModal(null)}
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