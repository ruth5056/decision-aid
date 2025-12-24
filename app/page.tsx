import Link from "next/link";

function Card({
  title,
  desc,
  href,
  cta,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="block border-2 border-gray-200 rounded-3xl bg-white p-6 sm:p-7 hover:border-gray-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700 leading-relaxed">{desc}</p>
        </div>
        <div className="shrink-0 text-blue-700 font-semibold">{cta} →</div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 space-y-8">
        {/* Header */}
        <header className="rounded-3xl bg-teal-700 px-6 sm:px-10 py-8 sm:py-10 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            凍卵決策輔助工具
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/95 leading-relaxed">
            給正在考慮是否「凍卵」的你：提供凍卵相關資訊、計算，幫助您釐清您對凍卵的考量，協助你和醫師做共同決策。
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/education"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-teal-800 font-semibold hover:bg-white/90"
            >
              從凍卵介紹開始 →
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              直接做凍卵計算機 →
            </Link>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-white/85">
            本網站內容僅供凍卵決策輔助使用，無法取代專業醫療建議；在開始凍卵療程前，請諮詢生殖內分泌（不孕症）專科醫師。
          </p>
        </header>


        {/* Quick access cards */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">快速入口</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card
              title="凍卵衛教資訊"
              desc="用段落化內容快速掌握：為何凍卵、成功率、幾歲適合、凍幾顆、流程、費用、保存與使用。"
              href="/education"
              cta="開始閱讀"
            />
            <Card
              title="凍卵計算機"
              desc="輸入年齡與成熟卵子數，顯示 ≥1/≥2/≥3 次活產機率；也可反向估算達到目標所需卵子數。"
              href="/calculator"
              cta="開始試算"
            />
            <Card
              title="「凍卵」或「不凍卵」"
              desc="以「優點／缺點／不確定性」比較「凍卵」或「不凍卵」兩種選擇"
              href="/options"
              cta="開始比較"
            />
            <Card
              title="您的凍卵考量"
              desc="協助釐清凍您對凍卵的考量，並且可以匯出列印摘要帶去門診討論。"
              href="/values"
              cta="前往我的凍卵考量"
            />
          </div>
        </section>

        {/* Footer note */}
        <footer className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          建議：若你正在考慮凍卵，請記錄你最在意的 3 件事（例如：成功率、費用、副作用等），並把試算結果和摘要帶去門診一起討論。
        </footer>
      </div>
    </main>
  );
}
