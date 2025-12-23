"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Answers = {
  importance: number; // 生育重要性
  costConcern: number; // 費用/資源顧慮
  medicalComfort: number; // 對醫療介入的接受度
};

function Scale({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="font-medium mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 w-14">不同意</span>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 w-14 text-right">同意</span>
        <span className="ml-2 text-sm font-semibold w-6 text-center">{value}</span>
      </div>
    </div>
  );
}

export default function ValuesPage() {
  const [answers, setAnswers] = useState<Answers>({
    importance: 3,
    costConcern: 3,
    medicalComfort: 3,
  });

  const profile = useMemo(() => {
    // 中性摘要（不推薦任何選項）
    const notes: string[] = [];

    if (answers.importance >= 4) notes.push("你較重視未來擁有生育（或保留生育可能性）的選項。");
    if (answers.importance <= 2) notes.push("你目前對生育相關議題的重視程度較低，或有其他優先順序。");

    if (answers.costConcern >= 4) notes.push("你對費用／時間／資源投入較敏感。");
    if (answers.costConcern <= 2) notes.push("費用／時間／資源投入對你而言相對不是主要阻礙。");

    if (answers.medicalComfort >= 4) notes.push("你對醫療介入與療程的不適感受相對能接受。");
    if (answers.medicalComfort <= 2) notes.push("你對醫療介入與療程不適較在意，可能需要更多資訊與支持。");

    if (notes.length === 0) notes.push("你的回答較為中間，建議再結合更多資訊與諮詢來整理想法。");

    return notes;
  }, [answers]);

  const summaryUrl = useMemo(() => {
    const params = new URLSearchParams({
      importance: String(answers.importance),
      costConcern: String(answers.costConcern),
      medicalComfort: String(answers.medicalComfort),
    });
    return `/summary?${params.toString()}`;
  }, [answers]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2">價值澄清</h1>
        <p className="text-gray-700 mb-6">
          請依照你目前的想法作答。這不是測驗，也沒有標準答案。
        </p>

        <div className="space-y-4 mb-6">
          <Scale
            label="1) 對我而言，未來擁有生育（或保留生育可能性）很重要。"
            value={answers.importance}
            onChange={(v) => setAnswers((a) => ({ ...a, importance: v }))}
          />
          <Scale
            label="2) 我非常在意費用／時間／請假與回診等資源投入。"
            value={answers.costConcern}
            onChange={(v) => setAnswers((a) => ({ ...a, costConcern: v }))}
          />
          <Scale
            label="3) 我能接受醫療介入（打針、取卵等）與可能的不適。"
            value={answers.medicalComfort}
            onChange={(v) => setAnswers((a) => ({ ...a, medicalComfort: v }))}
          />
        </div>

        <div className="bg-gray-50 border rounded-lg p-4 mb-8">
          <div className="font-semibold mb-2">你的初步整理（中性摘要）</div>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {profile.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/calculator" className="text-blue-600 hover:underline">
            ← 回到凍卵計算機
          </Link>
          <Link
            href={summaryUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            下一步：查看摘要 →
          </Link>
        </div>
      </div>
    </main>
  );
}
