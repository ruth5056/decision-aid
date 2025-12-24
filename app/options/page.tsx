import Link from "next/link";

function OptionCard({
  title,
  pros,
  cons,
  uncertainties,
}: {
  title: string;
  pros: string[];
  cons: string[];
  uncertainties: string[];
}) {
  return (
    <section className="border-2 border-gray-200 rounded-3xl bg-white p-5 sm:p-7 space-y-5">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
        {title}
      </h2>

      {/* 優點 / 缺點：左右兩欄（手機自動變一欄） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-gray-50 p-4">
          <div className="font-semibold text-gray-900 mb-2">優點</div>
          <ul className="space-y-2 text-sm sm:text-base text-gray-900 leading-relaxed">
            {pros.map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gray-600 flex-none" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <div className="font-semibold text-gray-900 mb-2">缺點</div>
          <ul className="space-y-2 text-sm sm:text-base text-gray-900 leading-relaxed">
            {cons.map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gray-600 flex-none" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 不確定性：下方整欄 */}
      <div className="rounded-2xl border bg-gray-50 p-4">
        <div className="font-semibold text-gray-900 mb-2">不確定性</div>
        <ul className="space-y-2 text-sm sm:text-base text-gray-900 leading-relaxed">
          {uncertainties.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-gray-600 flex-none" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


export default function OptionsPage() {
  return (
    <main className="space-y-6">
      <header className="rounded-3xl bg-slate-900 px-6 py-8 text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">我希望保存生育力，我有什麼選擇呢？</h1>
        <p className="mt-2 text-sm sm:text-base text-white/85">
          以下整理三種選擇的優點、缺點與不確定性，協助你和醫師討論。
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/education"
            className="px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-white/90 text-sm font-semibold"
          >
            回到凍卵介紹
          </Link>
          <Link
            href="/calculator"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
          >
            前往凍卵計算機 →
          </Link>
        </div>
      </header>

      <OptionCard
        title="立刻接受凍卵療程，盡快保存生育力"
        pros={[
          "可在目前年齡保存卵子，卵子品質相對較佳",
          "降低未來因年齡增加導致卵子品質下降的風險",
          "可提早完成療程，避免未來因健康狀況或時間限制而無法進行",
        ]}
        cons={[
          "需立即承擔療程相關費用與每年冷凍保存費",
          "需接受荷爾蒙注射與取卵手術，可能造成身體不適",
          "卵子庫存量高的年輕女性，發生卵巢過度刺激的風險較高",
        ]}
        uncertainties={[
          "無法確定未來是否會需要或使用冷凍卵子",
          "無法保證未來一定能成功懷孕或活產",
          "未來的伴侶狀況、婚姻狀態與法律規範可能影響使用方式",
        ]}
      />


      <OptionCard
        title="不要凍卵，未來或嘗試自然受孕，或考慮使用捐贈的卵子生育"
        pros={[
          "不需承擔凍卵療程的副作用、風險和費用",
          "捐贈卵子多來自年輕捐贈者，懷孕活產率相對較高",
        ]}
        cons={[
          "卵子品質和庫存量隨年齡增長而下降，未來即使接受試管療程，仍可能無法懷孕生產",
          "若使用捐贈卵子，胚胎與女性本人無遺傳連結",
        ]}
        uncertainties={[
          "未來對生育的想法可能隨時間改變",
          "使用捐贈卵子需符合當時法律規範與醫療流程",
        ]}
      />

      <section className="border-2 border-gray-200 rounded-3xl bg-white p-5 sm:p-7">
        <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
          不同選擇各有其優點、限制與不確定性，適合與否取決於個人年齡、生育計畫、身體狀況與價值觀，建議與生殖內分泌專科醫師充分討論後再做決定。
        </p>
      </section>

      <div className="flex justify-between">
      <Link href="/education" className="text-blue-600 hover:underline">
            ← 回到凍卵介紹
          </Link>
      <Link href="/calculator" className="text-blue-600 underline">
            前往凍卵計算機→
       </Link>
      </div>


    </main>
  );
}
