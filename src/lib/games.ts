export type GameEntry = {
  slug: string;
  title: string;
  tagline: string;
  href: string;
  color: string;
  tags: string[];
  featured?: boolean;
};

export const games: GameEntry[] = [
  {
    slug: "shibuya-rush",
    title: "SHIBUYA RUSH",
    tagline: "ハチ公前から渋谷の人ごみをかき分け、目的地へ急ぐダッシュゲーム。スキルで人波を突破しよう。",
    href: "/shibuya-rush/index.html",
    color: "#ff9a2e",
    tags: ["ブラウザ", "1人用", "ダッシュ"],
    featured: true,
  },
  {
    slug: "ito",
    title: "ito",
    tagline: "数字を言葉で例えて、みんなで順番に並べる協力ゲーム。",
    href: "/ito",
    color: "#4aa8ff",
    tags: ["オンライン", "みんなで", "会話"],
  },
  {
    slug: "molkky",
    title: "モルック スコア",
    tagline: "モルックの得点を記録して、履歴まで見られるスコアボード。",
    href: "/molkky",
    color: "#7ad07a",
    tags: ["スコア管理", "みんなで"],
  },
  {
    slug: "karuta",
    title: "かるた",
    tagline: "読み札を聞いて、絵札を素早く取るかるたゲーム。",
    href: "/karuta",
    color: "#ff6b8b",
    tags: ["ブラウザ", "反射神経"],
  },
];
