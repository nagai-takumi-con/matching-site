import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-pink-600">❤️ 婚活サイト</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700"
              >
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">素敵な出会いを</span>
            <span className="block text-pink-600">見つけましょうよ！</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            あなたの運命の人との出会いをサポートします。安全で安心な環境で、真剣な出会いを見つけませんか？
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:py-4 md:text-lg md:px-10"
              >
                無料で始める
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-pink-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>

        {/* 特徴セクション */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-lg font-medium text-gray-900">安全・安心</h3>
                <p className="mt-2 text-gray-500">
                  厳格な本人確認とプライバシー保護で、安心して利用できます。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-lg font-medium text-gray-900">マッチング精度</h3>
                <p className="mt-2 text-gray-500">
                  詳細なプロフィールと好みに基づいて、最適な相手をご紹介します。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900">メッセージ機能</h3>
                <p className="mt-2 text-gray-500">
                  気になる相手と安全にメッセージを交換できます。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 統計セクション */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">利用者統計</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <div className="text-4xl font-bold text-pink-600">10,000+</div>
                <div className="text-gray-500">登録ユーザー</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-600">500+</div>
                <div className="text-gray-500">成功カップル</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-600">95%</div>
                <div className="text-gray-500">満足度</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">❤️ 婚活サイト</h3>
            <p className="text-gray-300">
              素敵な出会いをサポートする婚活サイト
            </p>
            <div className="mt-8">
              <p className="text-gray-400 text-sm">
                © 2024 婚活サイト. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
