"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function getNum(sp: URLSearchParams, key: string, fallback = 3) {
  const v = Number(sp.get(key));
  return Number.isFinite(v) && v >= 1 && v <= 5 ? v : fallback;
}

function SummaryInner() {
  const sp = useSearchParams();

  const importance = getNum(sp, "importance");
  const costConcern = getNum(sp, "costConcern");
  const medicalComfort = getNum(sp, "medicalComfort");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2">你的摘要</h1>
        <p className="text-gray-700 mb-6">
          以下摘要僅用於協助你與醫師/諮詢者討論，不代表建議或結論。
        </p>

        <div className="grid gap-3 mb-6">
          <div className="border rounded-lg p-4">
            <div className="font-semibold">生育重要性</div>
            <div className="text-gray-700">分數：{importance} / 5</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="font-semibold">費用／資源顧慮</div>
            <div className="text-gray-700">分數：{costConcern} / 5</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="font-semibold">對醫療介入的接受度</div>
            <div className="text-gray-700">分數：{medicalComfort} / 5</div>
          </div>
        </div>

        <div className="bg-gray-50 border rounded-lg p-4 mb-8">
          <div className="font-semibold mb-2">建議你帶去討論的問題</div>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>以我的年齡與狀況，可能的成功率大概落在哪個範圍？</li>
            <li>若我想「延後再評估」，多久後再回來討論比較適合？</li>
            <li>我最在意的點（費用/時間/身體不適）有哪些替代方案或支持資源？</li>
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/values" className="text-blue-600 hover:underline">
            ← 回到價值澄清
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
