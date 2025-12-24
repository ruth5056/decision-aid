"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

function getNum(sp: URLSearchParams, key: string, fallback = 3) {
  const v = Number(sp.get(key));
  return Number.isFinite(v) && v >= 1 && v <= 5 ? v : fallback;
}

function avg(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / Math.max(1, nums.length);
}

function round1(x: number) {
  return Math.round(x * 10) / 10;
}

function SummaryInner() {
  const sp = useSearchParams();

  const pro1 = getNum(sp, "pro1");
  const pro2 = getNum(sp, "pro2");
  const pro3 = getNum(sp, "pro3");
  const con1 = getNum(sp, "con1");
  const con2 = getNum(sp, "con2");
  const con3 = getNum(sp, "con3");

  const computed = useMemo(() => {
    const pros = [pro1, pro2, pro3];
    const cons = [con1, con2, con3];

    const prosAvg = avg(pros);
    const consAvg = avg(cons);
    const balance = prosAvg - consAvg; // >0 動機較強；<0 顧慮較強（僅用於中性整理）

    // 中性摘要句
    let overallNote =
      "你的回答顯示你同時看見凍卵的可能好處與顧慮，建議把最在意的點帶去與醫師/諮詢者討論。";
    if (balance >= 0.8) {
      overallNote = "整體來看，你更重視凍卵可能帶來的好處，顧慮相對較少（此為整理，不代表建議）。";
    } else if (balance <= -0.8) {
      overallNote = "整體來看，你的顧慮相對較多，可能需要更多資訊來協助釐清（此為整理，不代表建議）。";
    }

    // 找出最突出的顧慮
    const concerns = [
      { id: "con1", label: "擔心效果不足／未來仍可能無法成功生育", score: con1 },
      { id: "con2", label: "費用負擔", score: con2 },
      { id: "con3", label: "療程不適與風險", score: con3 },
    ].sort((a, b) => b.score - a.score);

    const topConcerns = concerns.filter((c) => c.score >= 4);

    // 找出最強的動機
    const motivations = [
      { id: "pro1", label: "重視提升/保留未來生育可能性", score: pro1 },
      { id: "pro2", label: "希望對未來生育計畫更有自主性", score: pro2 },
      { id: "pro3", label: "即使可能用不到仍覺得值得", score: pro3 },
    ].sort((a, b) => b.score - a.score);

    const topMotivations = motivations.filter((m) => m.score >= 4);

    // 生成討論問題：依高分項目客製
    const questions: string[] = [];

    // 基礎必問
    questions.push("以我的年齡與狀況（AMH/卵巢庫存/超音波卵泡數等），預期一次取卵可能拿到幾顆卵？");
    questions.push("若我希望未來有較高機會生育，醫師通常建議凍幾顆卵、需要幾次療程？");

    // 針對顧慮加問
    if (con1 >= 4) {
      questions.push("凍卵『能提高成功率』與『只能保留當下卵子品質』差別是什麼？我應該如何理解成功率與不確定性？");
    }
    if (con2 >= 4) {
      questions.push("整體費用（療程、藥物、麻醉、保存費、未來解凍/受精/胚胎培養）大約落在哪個範圍？是否有分期/方案可選？");
    }
    if (con3 >= 4) {
      questions.push("常見不適與風險（例如 OHSS、麻醉、取卵後不適）在我身上大概風險如何？有哪些方式可降低？");
    }

    // 若動機強，也可以加「時間點」問題
    if (pro1 >= 4 || pro2 >= 4) {
      questions.push("如果我在 X 個月後再決定，對卵子數量/品質可能有什麼影響？我該如何選擇合適的時間點？");
    }

    // 若都很中間，加上替代方案探索
    const allMid = [pro1, pro2, pro3, con1, con2, con3].every((v) => v === 3);
    if (allMid) {
      questions.push("除了凍卵以外，還有哪些替代或搭配選項（例如先做卵巢功能評估、生活規劃、追蹤策略）？");
    }

    // 去重（避免同意思句）
    const deduped = Array.from(new Set(questions));

    return {
      prosAvg,
      consAvg,
      balance,
      overallNote,
      topConcerns,
      topMotivations,
      questions: deduped,
    };
  }, [pro1, pro2, pro3, con1, con2, con3]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2">你的摘要</h1>
        <p className="text-gray-700 mb-6">
          以下摘要僅用於協助你與醫師/諮詢者討論，不代表建議或結論。
        </p>

        {/* Overall */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="font-semibold mb-2">整體整理</div>
          <p className="text-gray-700 mb-3">{computed.overallNote}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border rounded-lg p-3 bg-white">
              <div className="font-semibold">Pros 平均</div>
              <div className="text-gray-700">{round1(computed.prosAvg)} / 5</div>
            </div>
            <div className="border rounded-lg p-3 bg-white">
              <div className="font-semibold">Cons 平均</div>
              <div className="text-gray-700">{round1(computed.consAvg)} / 5</div>
            </div>
            <div className="border rounded-lg p-3 bg-white">
              <div className="font-semibold">差值（Pros-Cons）</div>
              <div className="text-gray-700">{round1(computed.balance)}</div>
            </div>
          </div>

          {(computed.topMotivations.length > 0 || computed.topConcerns.length > 0) && (
            <div className="mt-4 text-gray-700">
              {computed.topMotivations.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold">你較重視的原因：</span>
                  {computed.topMotivations.map((m) => m.label).join("、")}
                </div>
              )}
              {computed.topConcerns.length > 0 && (
                <div>
                  <span className="font-semibold">你較在意的顧慮：</span>
                  {computed.topConcerns.map((c) => c.label).join("、")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Item scores */}
        <div className="grid gap-3 mb-6">
          <div className="border rounded-lg p-4">
            <div className="font-semibold">1) 能提升未來生育力對我而言非常重要。</div>
            <div className="text-gray-700">分數：{pro1} / 5</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="font-semibold">2) 我希望對未來的生育計畫更有自主性。</div>
            <div className="text-gray-700">分數：{pro2} / 5</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="font-semibold">3) 如果最後沒有使用凍卵，我仍然會很高興自己當初有決定凍卵。</div>
            <div className="text-gray-700">分數：{pro3} / 5</div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="font-semibold">
              4) 我擔心凍卵的效果不足，即使有凍卵，之後也無法成功生育。
            </div>
            <div className="text-gray-700">分數：{con1} / 5</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="font-semibold">5) 對我而言凍卵的費用是很大的負擔。</div>
            <div className="text-gray-700">分數：{con2} / 5</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="font-semibold">6) 我很擔心凍卵過程的不適和風險。</div>
            <div className="text-gray-700">分數：{con3} / 5</div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-8">
          <div className="font-semibold mb-2">建議你帶去討論的問題（依你的回答整理）</div>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {computed.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/values" className="text-blue-600 hover:underline">
            ← 回到我的凍卵考量
          </Link>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            列印 / 存成 PDF
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SummaryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
            <div className="text-gray-700">載入摘要中…</div>
          </div>
        </main>
      }
    >
      <SummaryInner />
    </Suspense>
  );
}
