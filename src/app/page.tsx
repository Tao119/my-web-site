import Link from "next/link";
import { games } from "src/lib/games";
import styles from "./hub.module.css";

export const metadata = {
  title: "Tao Games | ブラウザで遊べるゲーム集",
  description: "松村タオが作った、ブラウザですぐ遊べるゲームの集まり。SHIBUYA RUSH、ito、モルック、かるたなど。",
};

export default function Page() {
  const featured = games.find((g) => g.featured);
  const others = games.filter((g) => !g.featured);
  return (
    <div className={styles.root}>
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>TAO GAMES</h1>
        <p className={styles.lead}>ブラウザですぐ遊べる、ちいさなゲームの集まり。</p>
      </header>

      {featured && (
        <Link href={featured.href} className={styles.hero} style={{ ["--c" as string]: featured.color }}>
          <span className={styles.badge}>NEW</span>
          <h2>{featured.title}</h2>
          <p>{featured.tagline}</p>
          <span className={styles.play}>いますぐ遊ぶ ▶</span>
        </Link>
      )}

      <section className={styles.grid} aria-label="ゲーム一覧">
        {others.map((g) => (
          <Link key={g.slug} href={g.href} className={styles.card} style={{ ["--c" as string]: g.color }}>
            <h3>{g.title}</h3>
            <p>{g.tagline}</p>
            <ul>{g.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          </Link>
        ))}
      </section>

      <footer className={styles.footer}>
        <Link href="/portfolio">作者について</Link>
        <Link href="/privacy">プライバシーポリシー</Link>
        <span>© Tao Matsumura</span>
      </footer>
    </main>
    </div>
  );
}
