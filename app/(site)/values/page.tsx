"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Likert = 1 | 2 | 3 | 4 | 5;

type Answers = {
  // Pros
  pro1: Likert;
  pro2: Likert;
  pro3: Likert;

  // Cons
  con1: Likert;
  con2: Likert;
  con3: Likert;
};

type RankItem = {
  id: string;
  text: string;
};

function Scale({
  label,
  value,
  onChange,
  leftLabel,
  rightLabel,
  tone,
}: {
  label: string;
  value: Likert;
  onChange: (v: Likert) => void;
  leftLabel: string;
  rightLabel: string;
  tone: "green" | "pink";
}) {
  // 1~5 -> 0%~100%
  const pct = ((value - 1) / 4) * 100;

  // 由左到右「變深」：底色由很淡 -> 深色（未填區）
  // 再用填色表示目前選到的位置（填色也由淡->深，但比底色更實）
  const base =
    tone === "green"
      ? "linear-gradient(90deg, rgba(16,185,129,0.10), rgba(16,185,129,0.55))"
      : "linear-gradient(90deg, rgba(236,72,153,0.10), rgba(236,72,153,0.55))";

  const fill =
    tone === "green"
      ? `linear-gradient(90deg, rgba(16,185,129,0.25), rgba(16,185,129,0.95))`
      : `linear-gradient(90deg, rgba(236,72,153,0.25), rgba(236,72,153,0.95))`;

  const trackStyle: React.CSSProperties = {
    backgroundImage: `${fill}, ${base}`,
    backgroundSize: `${pct}% 100%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    borderRadius: 9999,
    height: 14,
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="font-medium mb-3 text-gray-900">{label}</div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700 w-16">{leftLabel}</span>

        <div className="flex-1">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value) as Likert)}
            className="w-full appearance-none cursor-pointer"
            style={trackStyle}
            aria-label={label}
          />
          <div className="flex justify-between text-[11px] text-gray-500 mt-2 px-1">
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
          </div>
        </div>

        <span className="text-sm text-gray-700 w-16 text-right">{rightLabel}</span>

        <span className="ml-2 text-sm font-semibold w-6 text-center">{value}</span>
      </div>
    </div>
  );
}

function ReorderList({
  items,
  setItems,
}: {
  items: RankItem[];
  setItems: (items: RankItem[]) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;

    const next = [...items];
    const from = next.findIndex((x) => x.id === dragId);
    const to = next.findIndex((x) => x.id === targetId);
    if (from < 0 || to < 0) return;

    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDragId(null);
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="font-semibold mb-1">重要性排序</div>
      <div className="text-sm text-gray-700 mb-3">請排序下列各項事宜對您的重要性（可拖曳）</div>

      <div className="space-y-3">
        {items.map((it) => (
          <div
            key={it.id}
            draggable
            onDragStart={() => setDragId(it.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(it.id)}
            className={[
              "border-2 rounded-lg px-4 py-3 bg-white cursor-move",
              "hover:bg-gray-50",
              dragId === it.id ? "opacity-60" : "",
            ].join(" ")}
            title="拖曳以排序"
          >
            <div className="font-semibold text-gray-900">{it.text}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        上方 = 較重要，下方 = 較不重要
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

  // ✅ 排序（照你圖上的四項）
  const [rank, setRank] = useState<RankItem[]>([
    { id: "r1", text: "擁有和自己有血緣關係的小孩" },
    { id: "r2", text: "保存未來生育力" },
    { id: "r3", text: "避免非必要的醫療處置" },
    { id: "r4", text: "凍卵療程所耗費的時間和費用" },
  ]);

  const computed = useMemo(() => {
    const pros = [answers.pro1, answers.pro2, answers.pro3];
    const cons = [answers.con1, answers.con2, answers.con3];

    const prosAvg = pros.reduce((a, b) => a + b, 0) / pros.length;
    const consAvg = cons.reduce((a, b) => a + b, 0) / cons.length;

    const balance = prosAvg - consAvg;
    const notes: string[] = [];

    if (balance >= 0.8) {
      notes.push("整體來看，你更重視凍卵可能帶來的好處，且顧慮相對較少。");
    } else if (balance <= -0.8) {
      notes.push("整體來看，你的顧慮相對較多，可能需要更多資訊來協助釐清。");
    } else {
      notes.push("整體來看，你對好處與顧慮的感受較為接近，屬於中間狀態。");
    }

    const strongPros: string[] = [];
    if (answers.pro1 >= 4) strongPros.push("你很在意提升/保留未來生育可能性。");
    if (answers.pro2 >= 4) strongPros.push("你希望對未來生育計畫保有更多自主性。");
    if (answers.pro3 >= 4) strongPros.push("你能接受『可能用不到』，但仍覺得凍卵值得。");
    if (strongPros.length > 0) notes.push("你較重視的原因：" + strongPros.join(" "));

    const concerns = [
      { text: "擔心凍卵效果不足、未來仍可能無法成功生育", score: answers.con1 },
      { text: "費用負擔", score: answers.con2 },
      { text: "療程不適與風險", score: answers.con3 },
    ]
      .slice()
      .sort((a, b) => b.score - a.score)
      .filter((c) => c.score >= 4);

    if (concerns.length > 0) {
      notes.push("你最在意的顧慮可能是：" + concerns.map((c) => c.text).join("、") + "。");
    } else {
      if (consAvg <= 2.2) notes.push("你目前對主要顧慮的同意程度較低，阻礙感相對較少。");
    }

    const allMid = Object.values(answers).every((v) => v === 3);
    if (allMid) notes.push("你的回答都偏中間，建議搭配更多資訊（費用、成功率、流程與風險）再整理想法。");

    return { prosAvg, consAvg, balance, notes };
  }, [answers]);

  const summaryUrl = useMemo(() => {
    const params = new URLSearchParams({
      pro1: String(answers.pro1),
      pro2: String(answers.pro2),
      pro3: String(answers.pro3),
      con1: String(answers.con1),
      con2: String(answers.con2),
      con3: String(answers.con3),

      // ✅ 帶排序到 summary：用 id 序列表示順序
      rank: rank.map((x) => x.id).join(","),
    });
    return `/summary?${params.toString()}`;
  }, [answers, rank]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Pros/Cons */}
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-2">我的凍卵考量</h1>
          <p className="text-gray-700 mb-6">請考量你目前的想法作答。這不是測驗，也沒有標準答案。</p>

          {/* Pros */}
          <div className="mb-6">
            <div className="font-semibold mb-3">Pros：下列事情對您的重要程度</div>
            <div className="space-y-4">
              <Scale
                label='1.「增加未來擁有孩子的機會」'
                value={answers.pro1}
                onChange={(v) => setAnswers((a) => ({ ...a, pro1: v }))}
                leftLabel="不重要"
                rightLabel="非常重要"
                tone="green"
              />
              <Scale
                label='2.「現在就對生育力做準備，而不是等到以後」'
                value={answers.pro2}
                onChange={(v) => setAnswers((a) => ({ ...a, pro2: v }))}
                leftLabel="不重要"
                rightLabel="非常重要"
                tone="green"
              />
              <Scale
                label='3.「能擁有與自己有血緣關係的孩子」'
                value={answers.pro3}
                onChange={(v) => setAnswers((a) => ({ ...a, pro3: v }))}
                leftLabel="不重要"
                rightLabel="非常重要"
                tone="green"
              />
            </div>
          </div>

          {/* Cons */}
          <div className="mb-6">
            <div className="font-semibold mb-3">Cons：下列事情讓您擔憂的程度</div>
            <div className="space-y-4">
              <Scale
                label='1.「凍卵無法保證我在未來想要孩子時一定能成功懷孕」'
                value={answers.con1}
                onChange={(v) => setAnswers((a) => ({ ...a, con1: v }))}
                leftLabel="不擔憂"
                rightLabel="非常擔憂"
                tone="pink"
              />
              <Scale
                label='2.「凍卵過程可能很辛苦（例如需要請假或可能出現副作用）」'
                value={answers.con2}
                onChange={(v) => setAnswers((a) => ({ ...a, con2: v }))}
                leftLabel="不擔憂"
                rightLabel="非常擔憂"
                tone="pink"
              />
              <Scale
                label='3.「凍卵很昂貴（我擔心花費不值得，或是我無法負擔）」'
                value={answers.con3}
                onChange={(v) => setAnswers((a) => ({ ...a, con3: v }))}
                leftLabel="不擔憂"
                rightLabel="非常擔憂"
                tone="pink"
              />
            </div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 mb-8">
            <div className="font-semibold mb-2">你的初步整理（摘要）</div>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {computed.notes.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            <div className="mt-3 text-sm text-gray-600">（僅整理你的想法，不代表建議或結論）</div>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/calculator" className="text-blue-600 hover:underline">
              ← 回到凍卵計算機
            </Link>
            <Link href={summaryUrl} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              下一步：查看摘要 →
            </Link>
          </div>
        </div>

        {/* RIGHT: Ranking */}
        <div className="bg-white rounded-lg shadow p-8">
          <ReorderList items={rank} setItems={setRank} />
        </div>
      </div>
    </main>
  );
}
