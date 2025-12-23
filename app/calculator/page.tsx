"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * 單顆成熟卵子的活產貢獻機率（EFCT 類型模型）
 * 僅供衛教與共同決策使用，非保證結果
 */
function perEggLiveBirthProb(age: number) {
  const a = Math.round(age);

  // p(Euploid)：≤35 歲統一使用 35 歲資料
  const pEuploidTable: Record<number, number> = {
    35: 0.574,
    36: 0.564,
    37: 0.486,
    38: 0.466,
    39: 0.44,
    40: 0.359,
    41: 0.327,
    42: 0.285,
    43: 0.206,
    44: 0.127,
  };

  const euploidAge = a <= 35 ? 35 : a >= 44 ? 44 : a;
  const pEuploid = pEuploidTable[euploidAge];

  // p(Blast)：35/36 為分界
  const base = Math.exp(2.8043 - 0.1112 * a);
  const pBlast = (a <= 35 ? 0.95 : 0.85) * base;

  // 單顆卵子對「最終活產」的近似貢獻
  const p = 0.6 * pEuploid * pBlast;

  return Math.max(0, Math.min(1, p));
}

/**
 * P(X ≥ k)，X ~ Binomial(n, p)
 */
function probAtLeastK(n: number, p: number, k: number) {
  const N = Math.max(0, Math.round(n));
  const K = Math.max(0, Math.round(k));

  if (K <= 0) return 1;
  if (N <= 0 || p <= 0) return 0;
  if (p >= 1) return K <= N ? 1 : 0;

  const q = 1 - p;
  let pmf = Math.pow(q, N); // P(X=0)
  let cdf = pmf;

  for (let i = 0; i < K - 1; i++) {
    pmf = pmf * ((N - i) / (i + 1)) * (p / q);
    cdf += pmf;
    if (cdf >= 1) break;
  }

  return Math.max(0, Math.min(1, 1 - cdf));
}

/**
 * 反向試算：達到指定活產次數與目標機率，所需最小成熟卵子數
 */
function minEggsForTarget(
  age: number,
  k: number,
  target: number,
  maxEggs = 50
) {
  const p = perEggLiveBirthProb(age);
  const t = Math.max(0, Math.min(1, target));

  for (let n = 0; n <= maxEggs; n++) {
    if (probAtLeastK(n, p, k) >= t) {
      return { n, prob: probAtLeastK(n, p, k) };
    }
  }
  return { n: null as number | null, prob: probAtLeastK(maxEggs, p, k) };
}

export default function CalculatorPage() {
  const [age, setAge] = useState(35);
  const [eggs, setEggs] = useState(15);

  /* 正向：同時顯示 ≥1 / ≥2 / ≥3 次活產 */
  const forward = useMemo(() => {
    const p = perEggLiveBirthProb(age);
    const toPct = (x: number) => Math.round(x * 1000) / 10;
    return {
      one: toPct(probAtLeastK(eggs, p, 1)),
      two: toPct(probAtLeastK(eggs, p, 2)),
      three: toPct(probAtLeastK(eggs, p, 3)),
    };
  }, [age, eggs]);

  /* 反向：選擇要幾次活產 */
  const [kTarget, setKTarget] = useState<1 | 2 | 3>(2);
  const [targetPct, setTargetPct] = useState(80);

  const reverse = useMemo(
    () => minEggsForTarget(age, kTarget, targetPct / 100, 50),
    [age, kTarget, targetPct]
  );

  return (
    <main className="bg-white rounded-lg shadow p-8 space-y-8">
      <h1 className="text-2xl font-bold">
        凍卵計算機：我要凍多少卵？（年齡、活產率和冷凍卵子數的關係）
      </h1>

      <p className="text-gray-700">
        本試算工具用於凍卵決策討論，實際情況受個體差異、實驗室條件影響。
      </p>

      {/* 年齡 */}
      <div className="border rounded-lg p-4">
        <div className="font-medium mb-2">
          凍卵當下年齡：{age} 歲
        </div>
        <input
          type="range"
          min={35}
          max={44}
          value={age}
          onChange={(e) => setAge(+e.target.value)}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-1">
          本計算模型將24–35歲視為同一個年齡區間，因為女性在35歲以前生育力相對穩定，在35歲之後則明顯下降。
        </div>
      </div>

      {/* 卵子數 */}
      <div className="border rounded-lg p-4">
        <div className="font-medium mb-2">
          冷凍成熟卵子數（MII）：{eggs} 顆
        </div>
        <input
          type="range"
          min={0}
          max={50}
          value={eggs}
          onChange={(e) => setEggs(+e.target.value)}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-1">
          顯示範圍：0–50 顆
        </div>
      </div>

      {/* 正向結果 */}
      <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
        <div className="font-semibold">預期活產率（按照凍卵當下年齡和成熟卵子數計算）</div>
        <div>≥ 1 次活產：約 {forward.one}%</div>
        <div>≥ 2 次活產：約 {forward.two}%</div>
        <div>≥ 3 次活產：約 {forward.three}%</div>
      </div>

      {/* 反向結果 */}
      <div className="bg-gray-50 border rounded-lg p-4 space-y-4">
        <div className="font-semibold">要達到我期待的活產率，我需要冷凍多少成熟卵子？</div>

        <div>
          <div className="font-medium mb-1">目標：至少幾次活產？</div>
          <div className="flex gap-2">
            {[1, 2, 3].map((k) => (
              <button
                key={k}
                onClick={() => setKTarget(k as 1 | 2 | 3)}
                className={
                  "px-3 py-2 rounded border " +
                  (kTarget === k
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white")
                }
              >
                ≥ {k} 次
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="font-medium mb-1">
            目標機率：{targetPct}%
          </div>
          <input
            type="range"
            min={10}
            max={95}
            value={targetPct}
            onChange={(e) => setTargetPct(+e.target.value)}
            className="w-full"
          />
        </div>

        {reverse.n === null ? (
          <div>
            在 50 顆內仍未達到目標（50 顆時約{" "}
            {Math.round(reverse.prob * 1000) / 10}%）
          </div>
        ) : (
          <div>
            <span className="font-bold">
              至少需要約 {reverse.n} 顆成熟卵子
            </span>
            <div className="text-sm text-gray-600">
              此時估算機率約{" "}
              {Math.round(reverse.prob * 1000) / 10}%
            </div>
          </div>
        )}
      </div>

      {/* 模型說明 */}
      <section className="border rounded-lg p-4 bg-gray-50">
        <details>
          <summary className="font-semibold cursor-pointer">
            計算模型說明與文獻來源
          </summary>
          <pre className="whitespace-pre-wrap text-sm mt-3">
{`p(Livebirth) = 1 – [1 – 0.6 × p(Euploid) × p(Blast)] ^ (Number of mature eggs)

p(Blast) = 0.95 × exp(2.8043 – 0.1112 × Age) if Age <36
p(Blast) = 0.85 × exp(2.8043 – 0.1112 × Age) if Age ≥36

註：
- 解凍卵子存活率：≤35 歲為 95%，≥36 歲為 85%
- 每顆卵子視為獨立貢獻的近似估算`}
          </pre>

          <p className="text-sm mt-2">
            主要參考文獻：Goldman RH et al., Human Reproduction, 2017（BWH Egg Freezing Counseling Tool）
          </p>
          <p className="text-sm">
            MDCalc：
            <a
              href="https://www.mdcalc.com/calc/3937/bwh-egg-freezing-counseling-tool-efct"
              target="_blank"
              className="text-blue-600 underline ml-1"
            >
              https://www.mdcalc.com/calc/3937/bwh-egg-freezing-counseling-tool-efct
            </a>
          </p>
        </details>
      </section>

      <div className="flex justify-between">
        <Link href="/options" className="text-blue-600 underline">
          ← 回到選項比較
        </Link>
        <Link href="/values" className="text-blue-600 underline">
          前往價值澄清 →
        </Link>
      </div>
    </main>
  );
}
