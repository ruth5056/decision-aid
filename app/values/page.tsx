"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Answers = {
  // Pros
  pro1: number; // 生育力重要
  pro2: number; // 自主性
  pro3: number; // 即使沒用到也不後悔

  // Cons
  con1: number; // 效果不足/仍可能無法生育
  con2: number; // 費用負擔
  con3: number; // 不適與風險
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
    pro1: 3,
    pro2: 3,
    pro3: 3,
    con1: 3,
    con2: 3,
    con3: 3,
  });

  const computed = useMemo(() => {
    const pros = [answers.pro1, answers.pro2, answers.pro3];
    const cons = [answers.con1, answers.con2, answers.con3];

    const prosAvg = pros.reduce((a, b) => a + b, 0) / pros.length;
    const consAvg = cons.reduce((a, b) => a + b, 0) / cons.length;

    // 使用者較「同意 Pros」且較「不同意 Cons」→較傾向凍卵（但仍中性措辭）
    // 注意：cons 是「顧慮/阻礙」題，同意越高代表顧慮越高
    const balance = prosAvg - consAvg; // >0 偏向 Pros；<0 顧慮較多
    const notes: string[] = [];

    // 方向性摘要（保持中性、不做推薦）
    if (balance >= 0.8) {
      notes.push("整體來看，你更重視凍卵可能帶來的好處，且顧慮相對較少。");
    } else if (balance <= -0.8) {
      notes.push("整體來看，你的顧慮相對較多，可能需要更多資訊來協助釐清。");
    } else {
      notes.push("整體來看，你對好處與顧慮的感受較為接近，屬於中間狀態。");
    }

    // 哪些「動機」較強
    const strongPros: string[] = [];
    if (answers.pro1 >= 4) strongPros.push("你很在意提升/保留未來生育可能性。");
    if (answers.pro2 >= 4) strongPros.push("你希望對未來生育計畫保有更多自主性。");
    if (answers.pro3 >= 4) strongPros.push("你能接受『可能用不到』，但仍覺得凍卵值得。");
    if (strongPros.length > 0) notes.push("你較重視的原因：" + strongPros.join(" "));

    // 哪些「顧慮」較突出
    const concerns: { key: keyof Answers; text: string; score: number }[] = [
      {
        key: "con1",
        text: "擔心凍卵效果不足、未來仍可能無法成功生育",
        score: answers.con1,
      },
      { key: "con2", text: "費用負擔", score: answers.con2 },
      { key: "con3", text: "療程不適與風險", score: answers.con3 },
    ];

    const topConcerns = concerns
      .slice()
      .sort((a, b) => b.score - a.score)
      .filter((c) => c.score >= 4);

    if (topConcerns.length > 0) {
      notes.push(
        "你最在意的顧慮可能是：" + topConcerns.map((c) => c.text).join("、") + "。"
      );
    } else {
      // 若沒有顯著顧慮，也給一句中性描述
      if (consAvg <= 2.2) notes.push("你目前對主要顧慮的同意程度較低，阻礙感相對較少。");
    }

    // 如果全都中間值
    const all = Object.values(answers);
    const allMid = all.every((v) => v === 3);
    if (allMid) notes.push("你的回答都偏中間，建議搭配更多資訊（費用、成功率、流程與風險）再整理想法。");

    return { prosAvg, consAvg, balance, notes };
  }, [answers]);

  const summaryUrl = useMemo(() => {
    // 直接把 6 題帶去 summary（你 summary 頁要記得接這 6 個參數）
    const params = new URLSearchParams({
      pro1: String(answers.pro1),
      pro2: String(answers.pro2),
      pro3: String(answers.pro3),
      con1: String(answers.con1),
      con2: String(answers.con2),
      con3: String(answers.con3),
    });
    return `/summary?${params.toString()}`;
  }, [answers]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2">我的凍卵考量</h1>
        <p className="text-gray-700 mb-6">
          請依照你目前的想法作答。這不是測驗，也沒有標準答案。
        </p>

        {/* Pros */}
        <div className="mb-6">
          <div className="font-semibold mb-3">凍卵可能的好處（Pros）</div>
          <div className="space-y-4">
            <Scale
              label="1) 能提升未來生育力對我而言非常重要。"
              value={answers.pro1}
              onChange={(v) => setAnswers((a) => ({ ...a, pro1: v }))}
            />
            <Scale
              label="2) 我希望對未來的生育計畫更有自主性。"
              value={answers.pro2}
              onChange={(v) => setAnswers((a) => ({ ...a, pro2: v }))}
            />
            <Scale
              label="3) 如果最後沒有使用凍卵，我仍然會很高興自己當初有決定凍卵。"
              value={answers.pro3}
              onChange={(v) => setAnswers((a) => ({ ...a, pro3: v }))}
            />
          </div>
        </div>

        {/* Cons */}
        <div className="mb-6">
          <div className="font-semibold mb-3">凍卵可能的壞處（Cons）</div>
          <div className="space-y-4">
            <Scale
              label="4) 我擔心凍卵的效果不足，即使有凍卵，之後也無法成功生育。"
              value={answers.con1}
              onChange={(v) => setAnswers((a) => ({ ...a, con1: v }))}
            />
            <Scale
              label="5) 對我而言凍卵的費用是很大的負擔。"
              value={answers.con2}
              onChange={(v) => setAnswers((a) => ({ ...a, con2: v }))}
            />
            <Scale
              label="6) 我很擔心凍卵過程的不適和風險。"
              value={answers.con3}
              onChange={(v) => setAnswers((a) => ({ ...a, con3: v }))}
            />
          </div>
        </div>

        <div className="bg-gray-50 border rounded-lg p-4 mb-8">
          <div className="font-semibold mb-2">你的初步整理（中性摘要）</div>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {computed.notes.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <div className="mt-3 text-sm text-gray-600">
            （僅整理你的想法，不代表建議或結論）
          </div>
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
