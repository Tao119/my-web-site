export type GameEntry = {
  slug: string;
  title: string;
  tagline: string;
  href: string;
  color: string;
  tags: string[];
  featured?: boolean;
  /** true のゲームは一覧に出さない(URLを直接入力すれば開ける) */
  hidden?: boolean;
};

export const games: GameEntry[] = [
  {
    slug: "shibuya-rush",
    title: "SHIBUYA RUSH",
    tagline: "ハチ公前から渋谷の人ごみをかき分け、目的地へ急ぐダッシュゲーム。スキルで人波を突破しよう。",
    href: "/games/shibuya-rush",
    color: "#ff9a2e",
    tags: ["ブラウザ", "1人用", "ダッシュ"],
    featured: true,
  },
  {
    slug: "dopamine",
    title: "DOPAMINE",
    tagline: "ドーパミンを、さわって学ぶ。出典つきのシミュレーションで、報酬と予測のしくみを体験する神経科学ポータル。",
    href: "/games/dopamine",
    color: "#b66bff",
    tags: ["体験型", "神経科学", "3D"],
  },
  {
    slug: "ito",
    title: "ito",
    tagline: "数字を言葉で例えて、みんなで順番に並べる協力ゲーム。",
    href: "/games/ito",
    color: "#4aa8ff",
    tags: ["オンライン", "みんなで", "会話"],
    hidden: true,
  },
  {
    slug: "molkky",
    title: "モルック スコア",
    tagline: "モルックの得点を記録して、履歴まで見られるスコアボード。",
    href: "/games/molkky",
    color: "#7ad07a",
    tags: ["スコア管理", "みんなで"],
    hidden: true,
  },
  {
    slug: "karuta",
    title: "かるた",
    tagline: "読み札を聞いて、絵札を素早く取るかるたゲーム。",
    href: "/games/karuta",
    color: "#ff6b8b",
    tags: ["ブラウザ", "反射神経"],
    hidden: true,
  },
];

export const visibleGames = games.filter((g) => !g.hidden);
