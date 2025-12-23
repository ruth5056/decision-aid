"use client";

import { useMemo, useState } from "react";

type BandPoint = { age: number; min: number; max: number };

// 來源：你的衛教單張（80%目標所需 MII 卵子數區間）
// <35: 15; 35–37: 18–25; 38–40: 30–50
const band: BandPoint[] = [
  { age: 34, min: 15, max: 15 },
  { age: 36, min: 18, max: 25 },
  { age: 39, min: 30, max: 50 },
];

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function RangeBandChart({
  title,
  subtitle,
  points,
  xMin,
  xMax,
  yMin,
  yMax,
}: {
  title: string;
  subtitle: string;
  points: BandPoint[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}) {
  const W = 720;
  const H = 260;
  const pad = 44;

  const x = (age: number) =>
    pad + ((age - xMin) / (xMax - xMin)) * (W - pad * 2);
  const y = (val: number) =>
    pad + (1 - (val - yMin) / (yMax - yMin)) * (H - pad * 2);

  // Build band polygon: top = max line, bottom = min line reversed
  const top = points.map((p) => `${x(p.age)},${y(p.max)}`).join(" ");
  const bottom = [...points]
    .reverse()
    .map((p) => `${x(p.age)},${y(p.min)}`)
    .join(" ");
  const bandPoints = `${top} ${bottom}`;

  // Axis ticks
  const xTicks = [34, 35, 36, 37, 38, 39, 40];
  const yTicks = [10, 20, 30, 40, 50];

  return (
    <section className="border rounded-lg p-5 bg-white">
      <div className="mb-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[560px]"
          role="img"
          aria-label={title}
        >
          {/* grid */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={pad}
                x2={W - pad}
                y1={y(t)}
                y2={y(t)}
                className="stroke-gray-200"
                strokeWidth="1"
              />
              <text
                x={pad - 10}
                y={y(t) + 4}
                textAnchor="end"
                className="fill-gray-500"
                fontSize="12"
              >
                {t}
              </text>
            </g>
          ))}

          {xTicks.map((t) => (
            <g key={t}>
              <line
                y1={pad}
                y2={H - pad}
                x1={x(t)}
                x2={x(t)}
                className="stroke-gray-100"
                strokeWidth="1"
              />
              <text
                x={x(t)}
                y={H - pad + 20}
                textAnchor="middle"
                className="fill-gray-500"
                fontSize="12"
              >
                {t}
              </text>
            </g>
          ))}

          {/* axes */}
          <line
            x1={pad}
            x2={W - pad}
            y1={H - pad}
            y2={H - pad}
            className="stroke-gray-300"
            strokeWidth="1.5"
          />
          <line
            x1={pad}
            x2={pad}
            y1={pad}
            y2={H - pad}
            className="stroke-gray-300"
            strokeWidth="1.5"
          />

          {/* band */}
          <polygon
            points={bandPoints}
            className="fill-gray-200"
            opacity="0.8"
          />

          {/* min/max lines */}
          <polyline
            points={points.map((p) => `${x(p.age)},${y(p.max)}`).join(" ")}
            className="fill-none stroke-gray-700"
            strokeWidth="2"
          />
          <polyline
            points={points.map((p) => `${x(p.age)},${y(p.min)}`).join(" ")}
            className="fill-none stroke-gray-700"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* points */}
          {points.map((p) => (
            <g key={p.age}>
              <circle
                cx={x(p.age)}
                cy={y(p.max)}
                r="4"
                className="fill-gray-800"
              />
              <circle
                cx={x(p.age)}
                cy={y(p.min)}
                r="4"
                className="fill-gray-800"
              />
            </g>
          ))}

          {/* labels */}
          <text
            x={W / 2}
            y={H - 8}
            textAnchor="middle"
            className="fill-gray-600"
            fontSize="12"
          >
            凍卵年齡（歲）
          </text>
          <text
            x={16}
            y={H / 2}
            textAnchor="middle"
            className="fill-gray-600"
            fontSize="12"
            transform={`rotate(-90 16 ${H / 2})`}
          >
            成熟卵子數（MII）
          </text>
        </svg>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        灰色區塊代表「約需成熟卵子數」的參考區間：&lt;35 歲約 15 顆；35–37 歲約 18–25 顆；38–40 歲約 30–50 顆。
      </div>
      <div className="mt-1 text-xs text-gray-500">
        註：此為概略衛教參考，並非保證；個體卵巢功能與實驗室條件會影響結果。
      </div>
    </section>
  );
}

function TreatmentTimeline() {
  const days = [
    { d: "Day 1–2", t: "月經來 / 開始評估與用藥" },
    { d: "Day 3–12", t: "排卵刺激（注射藥物）" },
    { d: "期間", t: "回診追蹤 2–4 次（抽血＋超音波）" },
    { d: "最後", t: "取卵（靜脈麻醉 15–60 分鐘）" },
    { d: "同日", t: "成熟卵子冷凍保存" },
  ];

  return (
    <section className="border rounded-lg p-5 bg-white">
      <h3 className="font-semibold mb-1">圖表：凍卵療程時間軸（約 14 天）</h3>
      <p className="text-sm text-gray-600 mb-4">
        以常見流程整理，實際會依個人用藥反應調整。
      </p>

      <ol className="space-y-3">
        {days.map((x, i) => (
          <li key={i} className="border rounded-lg p-4">
            <div className="text-sm text-gray-600">{x.d}</div>
            <div className="font-medium">{x.t}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function EducationCharts() {
  const [age, setAge] = useState(35);

  // 小加分：在衛教頁也給一個「對照提示」，告訴病人目前年齡落在哪個區間
  const bandHint = useMemo(() => {
    const a = clamp(age, 24, 44);
    if (a < 35) return "你目前選的年齡落在 <35 歲區間：80% 目標約 15 顆（概略參考）。";
    if (a <= 37) return "你目前選的年齡落在 35–37 歲區間：80% 目標約 18–25 顆（概略參考）。";
    if (a <= 40) return "你目前選的年齡落在 38–40 歲區間：80% 目標約 30–50 顆（概略參考）。";
    return "你目前選的年齡 >40 歲：建議以個別化諮詢評估（概略表不涵蓋）。";
  }, [age]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-5 bg-gray-50">
        <div className="font-semibold mb-2">快速對照（衛教用）</div>
        <div className="mb-2 text-sm text-gray-700">{bandHint}</div>
        <div className="text-sm text-gray-700 font-medium mb-2">選擇年齡：{age} 歲</div>
        <input
          type="range"
          min={24}
          max={44}
          step={1}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <RangeBandChart
        title="圖表：達到約 80% 活產率目標所需成熟卵子數（參考區間）"
        subtitle="用區間呈現比單一數字更能反映不確定性"
        points={band}
        xMin={34}
        xMax={40}
        yMin={10}
        yMax={55}
      />

      <TreatmentTimeline />
    </div>
  );
}
