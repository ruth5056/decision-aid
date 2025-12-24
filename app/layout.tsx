import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "決策輔助工具",
  description: "Web-based decision aid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold hover:underline">
              我要凍卵嗎？
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/education" className="text-blue-600 hover:underline">
                凍卵介紹
              </Link>
              <Link href="/options" className="text-blue-600 hover:underline">
                凍或不凍？
              </Link>       
              <Link href="/calculator" className="text-blue-600 hover:underline">
                凍卵計算機
              </Link>
              <Link href="/values" className="text-blue-600 hover:underline">
                我的凍卵考量
              </Link>
              <Link href="/summary" className="text-blue-600 hover:underline">
                摘要
                
              </Link>
            </nav>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">{children}</div>

        <footer className="border-t bg-white">
          <div className="max-w-4xl mx-auto px-6 py-4 text-sm text-gray-600">
            本工具僅供凍卵決策討論之用，無法取代專業醫師諮詢。
          </div>
        </footer>
      </body>
    </html>
  );
}
