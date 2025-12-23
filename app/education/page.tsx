import Link from "next/link";
import Image from "next/image";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-gray-200 rounded-3xl bg-white p-5 sm:p-7 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="text-gray-900 leading-relaxed text-sm sm:text-base space-y-3">
        {children}
      </div>
    </section>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  // Allow JSX (e.g., <span>) inside paragraphs.
  return <p className="whitespace-pre-wrap">{children}</p>;
}


function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-2 w-2 rounded-full bg-gray-600 flex-none" />
          <span className="whitespace-pre-wrap">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Numbered({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2 list-decimal pl-6">
      {items.map((t, i) => (
        <li key={i} className="whitespace-pre-wrap">
          {t}
        </li>
      ))}
    </ol>
  );
}

function FigureCard({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  return (
    <section className="border-2 border-gray-200 rounded-3xl bg-white p-5 sm:p-7 space-y-3">
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={src}
          alt={title}
          fill
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}

export default function EducationPage() {
  return (
    <main className="space-y-6">
      <header className="rounded-3xl bg-teal-700 px-6 py-8 text-white text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">我要凍卵嗎？</h1>
        <p className="mt-2 text-lg font-semibold opacity-95">
          給考慮凍卵女性的衛教說明
        </p>
      </header>

      {/* 1) 為什麼要凍卵? */}
      <Section title="為什麼要凍卵?">
        <Para>
         從生物學角度來看，女性的生育力<span className="font-semibold">在30歲前</span>達到高峰。</Para>
        <Para>
         然而，由於職涯、社會與人生規劃等多方面的考量，許多女性會選擇延後懷孕。 
        </Para>
        
        <Bullets
          items={[
            "女性天生的卵子數目有限，且不會再新生 ",
            "隨著年齡增長，卵子的數量與品質都會下降 ",
            "35歲以後，卵子數目與品質皆快速下降",
            "年齡越高，流產與染色體異常風險也越高 ",
          ]}
        />
      </Section>

      {/* 2) 只要凍卵就能成功生產嗎? */}
      <Section title="只要凍卵就能成功生產嗎?">
        <Para>
          每一顆冷凍卵子未來成功孕育出一位新生兒的機率，<span className="font-semibold">大約只有2–12%</span>。</Para>
        <Para>這個機率會隨著凍卵當時的年齡增加而降低。
        </Para>
        
        <Para>{"未來能否成功生產，主要取決於兩個因素:"}</Para>
        <Bullets
          items={[
            "凍卵當下的年齡(卵子品質)",
            "冷凍卵子的總數(可以嘗試懷孕的次數)",
          ]}
        />
      </Section>

{/* 圖一、圖二：放在成功率概念之後最合適 */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <FigureCard
    title="圖一：人工生殖年齡與活產率和流產率之關係（Ref: 111 年人工生殖施行結果分析報告）"
    src="/education/figure1.png"
  />
  <FigureCard
    title="圖二：不同年齡冷凍卵子數和預期活產率之關係（Ref: Goldman, Hum Reprod 2017）"
    src="/education/figure2.png"
  />
</div>


      {/* 3) 幾歲要凍卵呢? / 超過某個年齡就不適合凍卵了? */}
      <Section title="幾歲要凍卵呢?超過某個年齡就不適合凍卵了?">
        <Para>{"應先諮詢生殖內分泌(不孕症)專科醫師，進行評估與檢查，判斷是否適合凍卵。"}</Para>
        <Para>
          {
            "每個人的卵巢功能變化不同，無法準確預測未來生育力的變化。 "
          }
        </Para>
        <Para>
          多數專家認為，<span className="font-semibold">在30歲之後，38-40歲之前凍卵</span>成本效益較高且成功率相對較高。</Para>
        <Bullets
          items={[
            "太早凍卵:可能自然懷孕，沒機會使用。",
            "太晚凍卵:可能需多次療程，成功率較低。",
          ]}
        />
      </Section>

      {/* 4) 凍幾顆卵子才夠? */}
      <Section title="凍幾顆卵子才夠?">
        <Para>{"答案因人而異，和您期待的「活產率」有關。 "}</Para>
        <Para>
          {
            "「活產率」是指從一顆卵子開始，一路走到順利生產的整體機會。 \n這包含卵子解凍成功、受精成功、胚胎著床、持續懷孕並平安生產。  \n若希望能有80%成功產下寶寶的機會: "
          }
        </Para>
        <Bullets
          items={[
            "<35歲:需要15顆成熟卵子。 ",
            "35-37歲:需要18-25顆卵子。 ",
            "38-40歲:需要30-50顆卵子。 ",
          ]}
        />
        <Para>{"詳細計算可參考我們的凍卵計算機"}</Para>

        <div className="pt-2">
          <Link
            href="/calculator"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            前往凍卵計算機 →
          </Link>
        </div>
      </Section>

      {/* 5) 凍卵的療程會怎麼進行? */}
      <Section title="凍卵的療程會怎麼進行?">
        <Para>
          {
            "凍卵流程類似試管嬰兒療程的前半段，整個療程大約14天左右，主要分成以下幾個階段: "
          }
        </Para>
        <Numbered
          items={[
            "排卵刺激：注射賀爾蒙藥物大約連續10~12天，幫助多顆卵子一起成熟",
            "追蹤卵巢反應：療程期間需回診2-4次，透過抽血與超音波追蹤卵泡發育狀況。",
            "取卵手術：卵子成熟後，安排門診手術接受靜脈麻醉進行取卵手術，約15~60分鐘。 ",
            "冷凍卵子：取出的卵子會由胚胎師進行挑選與檢查，健康的成熟卵子會當天立即冷凍保存。 �",
          ]}
        />
      </Section>

      {/* 6) 凍卵要多少錢? */}
      <Section title="凍卵要多少錢?">
        <Para>
          {
            "以台大醫院為例，一次凍卵療程的費用大約落在新台幣8~12萬元之間 \n ＊實際金額會因個人用藥和取卵數而有所不同。 \n ＊每年須額外支付8500-17000元之冷凍保存年費。  "
          }
        </Para>
      </Section>

      {/* 7) 凍卵可以保存多久?要怎麼使用? */}
      <Section title="凍卵可以保存多久?要怎麼使用?">
        <Para>
          {
            "截至目前(2025年)，台灣人工生殖法規定: 人工生殖技術，限於合法婚姻關係的夫妻。 \n ＊未婚女性目前依法不得使用冷凍卵子進行受孕 \n ＊使用凍卵進行懷孕的年齡雖無法律上限，但建議在 45 歲前使用較安全。 "
          }
        </Para>
        <Para>
          {
            "如果未來並未使用冷凍卵子受孕，卵子可選擇直接銷毀、捐贈研究使用，未來或可能捐贈其他不孕夫妻使用。"
          }
        </Para>
      </Section>

      {/* 8) 我還有其他選擇嗎? */}
      <Section title="我希望保存生育力，我有什麼選擇呢？">
        <Numbered
          items={[
            "立刻接受凍卵療程，盡快保存生育力",
            "抽血檢測卵巢功能，若卵巢功能正常，可在30-37歲之間考慮接受凍卵療程",
            "不要凍卵，或是解凍後的卵子不足以生產，未來可考慮使用捐贈的卵子生育",
          ]}
        />

      </Section>

      {/* 9) 結語 */}
      <Section title="凍卵可以幫助妳提高未來擁有自己親生孩子的機會。 ">
        <Para>
          {
            "雖然「不能保證生育」，但多一份「生育保障」。" 
          }
        </Para>
      </Section>
    </main>
  );
}

