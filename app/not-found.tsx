import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">404</h1>
      <div className="absolute flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-3xl">
          ページが見つかりません
        </h2>
        <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400 md:text-base">
          お探しのページは削除されたか、URLが変更された可能性があります。
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
