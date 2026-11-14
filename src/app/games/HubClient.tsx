"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameEntry } from "src/lib/games";
import styles from "./hub.module.css";

const EMOJI = ["🎮", "✨", "⭐", "🕹️", "💥", "🚀", "🍡", "⚡"];
const SOON = ["???", "つくってる…", "おたのしみに", "ひみつ!", "もうすこし…"];

/** ロゴをクリックしたとき、絵文字を弾けさせる */
function burst(x: number, y: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("span");
    el.textContent = EMOJI[i % EMOJI.length];
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${18 + Math.random() * 18}px;pointer-events:none;z-index:99;will-change:transform,opacity`;
    document.body.appendChild(el);
    const a = Math.random() * Math.PI * 2;
    const d = 80 + Math.random() * 160;
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 90}px)) rotate(${Math.random() * 540 - 270}deg) scale(1)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" },
    ).onfinish = () => el.remove();
  }
}

/** ポインタに合わせて傾き、光が追いかけるカード */
function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onMove = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);
  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}

function Runners() {
  // 群衆の中を、オレンジの自分が追い抜いていく
  const crowd = [
    { d: 7.5, t: 14, c: "#5b6b88" }, { d: 9, t: 38, c: "#7a86a0" }, { d: 6.8, t: 62, c: "#4f5d78" },
    { d: 8.2, t: 80, c: "#8794ad" }, { d: 10, t: 26, c: "#66748f" }, { d: 7.1, t: 70, c: "#5b6b88" },
  ];
  return (
    <div className={styles.track} aria-hidden>
      {crowd.map((r, i) => (
        <i key={i} className={styles.runner} style={{ top: `${r.t}%`, animationDuration: `${r.d}s`, animationDelay: `${-i * 1.3}s`, background: r.c }} />
      ))}
      <i className={`${styles.runner} ${styles.me}`} />
      <span className={styles.goal}>🏁</span>
    </div>
  );
}

function Molecule() {
  return (
    <div className={styles.mol} aria-hidden>
      <i className={styles.nucleus} />
      {[0, 1, 2].map((i) => (
        <i key={i} className={styles.orbit} style={{ animationDelay: `${-i * 1.6}s`, ["--s" as string]: 1 + i * 0.45 }}>
          <b />
        </i>
      ))}
    </div>
  );
}

function TiltLink({ g, children, className }: { g: GameEntry; children: React.ReactNode; className: string }) {
  const tilt = useTilt<HTMLAnchorElement>();
  return (
    <Link href={g.href} className={className} style={{ ["--c" as string]: g.color }} {...tilt}>
      {children}
    </Link>
  );
}

export default function HubClient({ games }: { games: GameEntry[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [soon, setSoon] = useState(0);
  const featured = games.find((g) => g.featured);
  const others = games.filter((g) => !g.featured);

  // マウスに合わせて背景の光が動く
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // スクロールで順番に現れる
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io: IntersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add(styles.in);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.bg} aria-hidden>
        <i className={styles.blob1} />
        <i className={styles.blob2} />
        <i className={styles.blob3} />
        <i className={styles.gridlines} />
        <i className={styles.spot} />
      </div>

      <main className={styles.page}>
        <header className={styles.header}>
          <h1
            className={styles.logo}
            onClick={(e) => burst(e.clientX, e.clientY)}
            title="クリックしてみて"
          >
            {"TAO GAMES".split("").map((ch, i) => (
              <span key={i} className={styles.ch} style={{ animationDelay: `${i * 70}ms` }}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </h1>
          <p className={styles.lead}>ブラウザですぐ遊べる、ちいさなゲームの集まり。</p>
        </header>

        <div className={styles.ticker} aria-hidden>
          <div>
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k}>
                PLAY NOW ▶ NO INSTALL ▶ FREE ▶ BROWSER GAMES ▶ PLAY NOW ▶ NO INSTALL ▶ FREE ▶ BROWSER GAMES ▶
              </span>
            ))}
          </div>
        </div>

        {featured && (
          <TiltLink g={featured} className={styles.hero}>
            <span className={styles.shine} />
            <span className={styles.badge}>NEW</span>
            <Runners />
            <h2>{featured.title}</h2>
            <p>{featured.tagline}</p>
            <ul className={styles.tags}>{featured.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            <span className={styles.play}>いますぐ遊ぶ <b>▶</b></span>
          </TiltLink>
        )}

        <section className={styles.grid} aria-label="ゲーム一覧">
          {others.map((g, i) => (
            <div key={g.slug} data-reveal className={styles.reveal} style={{ transitionDelay: `${i * 90}ms` }}>
              <TiltLink g={g} className={styles.card}>
                <span className={styles.shine} />
                {g.slug === "dopamine" && <Molecule />}
                <h3>{g.title}</h3>
                <p>{g.tagline}</p>
                <ul className={styles.tags}>{g.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                <span className={styles.go}>開く <b>→</b></span>
              </TiltLink>
            </div>
          ))}

          <div data-reveal className={styles.reveal} style={{ transitionDelay: `${others.length * 90}ms` }}>
            <button type="button" className={styles.soon} onClick={() => setSoon((s) => (s + 1) % SOON.length)}>
              <span className={styles.q}>?</span>
              <span>{SOON[soon]}</span>
              <small>つぎのゲームを準備中</small>
            </button>
          </div>
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
