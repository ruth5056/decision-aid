import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">
          我要凍卵嗎？
        </h1>

        <p className="text-gray-700 mb-6">
          本互動式網頁將提供您凍卵相關資訊，
          並協助您釐清您對生育力保存的價值觀和考量。
        </p>



<Link
  href="/education"
  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  開始評估
</Link>

      </div>
    </main>
  )
}

