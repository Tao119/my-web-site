"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { GameEntry } from "src/lib/games";
import { ATOM, ATOM_PALETTE, BLOCK, BLOCK_PALETTE, RUNNER_A, RUNNER_B, RUNNER_PALETTE, Sprite } from "./Sprite";
import styles from "./hub.module.css";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const HI_KEY = "tao-arcade-hi";

type Cart = GameEntry | { slug: "soon"; title: string; tagline: string; color: string; tags: string[]; href?: undefined };

const SOON: Cart = {
  slug: "soon",
  title: "???",
  tagline: "つぎのカートリッジを準備中…。できたらここに差さります。",
  color: "#8b95b8",
  tags: ["COMING SOON"],
};

const pad = (n: number) => String(n).padStart(6, "0");

function Art({ slug }: { slug: string }) {
  if (slug === "shibuya-rush")
    return (
      <div className={styles.artRush}>
        <i className={styles.speed} />
        <i className={`${styles.speed} ${styles.s2}`} />
        <Sprite rows={RUNNER_A} palette={RUNNER_PALETTE} px={6} className={styles.frameA} />
        <Sprite rows={RUNNER_B} palette={RUNNER_PALETTE} px={6} className={styles.frameB} />
      </div>
    );
  if (slug === "dopamine")
    return (
      <div className={styles.artAtom}>
        <Sprite rows={ATOM} palette={ATOM_PALETTE} px={7} />
      </div>
    );
  return (
    <div className={styles.artBlock}>
      <Sprite rows={BLOCK} palette={BLOCK_PALETTE} px={7} />
    </div>
  );
}

export default function HubClient({ games }: { games: GameEntry[] }) {
  const carts: Cart[] = [...games, SOON];
  const [sel, setSel] = useState(0);
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(50000);
  const [typed, setTyped] = useState("");
  const [cheat, setCheat] = useState(false);
  const [jump, setJump] = useState(false);
  const konami = useRef(0);
  const cur = carts[sel];

  const addScore = useCallback((n: number) => setScore((s) => s + n), []);

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(HI_KEY));
      if (v > 0) setHi(v);
    } catch {}
  }, []);
  useEffect(() => {
    if (score > hi) {
      setHi(score);
      try {
        localStorage.setItem(HI_KEY, String(score));
      } catch {}
    }
  }, [score, hi]);

  const choose = useCallback(
    (i: number) => {
      setSel((p) => {
        if (p !== i) addScore(100);
        return i;
      });
    },
    [addScore],
  );

  const open = useCallback((c: Cart) => {
    if (c.href) window.location.assign(c.href);
  }, []);

  // キーボード: 矢印で選び、Enter で開く。コナミコマンドの隠し要素も。
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === KONAMI[konami.current]) {
        konami.current += 1;
        if (konami.current === KONAMI.length) {
          konami.current = 0;
          setCheat(true);
          addScore(30000);
        }
      } else {
        konami.current = k === KONAMI[0] ? 1 : 0;
      }
      if (k === "ArrowRight" || k === "ArrowDown") {
        setSel((p) => (p + 1) % carts.length);
        addScore(100);
      } else if (k === "ArrowLeft" || k === "ArrowUp") {
        setSel((p) => (p + carts.length - 1) % carts.length);
        addScore(100);
      }
      else if (k === "Enter") open(carts[sel]);
      else if (k === " ") {
        setJump(true);
        setTimeout(() => setJump(false), 520);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // RPG 風の 1 文字ずつ表示
  useEffect(() => {
    const text = cheat ? "コナミコマンド!! ライフが 30 ふえた! ゲームをたのしんでね!" : cur.tagline;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(text);
      return;
    }
    setTyped("");
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [cur, cheat]);

  const doJump = () => {
    if (jump) return;
    setJump(true);
    addScore(100);
    setTimeout(() => setJump(false), 520);
  };

  return (
    <div className={`${styles.root} ${cheat ? styles.cheat : ""}`}>
      <div className={styles.crt} aria-hidden />
      <main className={styles.page}>
        <div className={styles.hud}>
          <span>1UP <b>{pad(score)}</b></span>
          <span>HI-SCORE <b>{pad(hi)}</b></span>
          <span>CREDIT <b>01</b></span>
        </div>

        <header className={styles.header}>
          <h1 className={styles.logo} onClick={() => addScore(1000)}>
            {"TAO ARCADE".split("").map((ch, i) => (
              <span key={i} className={styles.ch} style={{ animationDelay: `${i * 90}ms` }}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </h1>
          <p className={styles.sub}>ブラウザで遊べる、ちいさなゲームたち</p>
          <p className={styles.start}>▶ カートリッジを えらんでね</p>
        </header>

        <section className={styles.shelf} aria-label="ゲーム一覧">
          {carts.map((c, i) => {
            const on = i === sel;
            const inner = (
              <>
                <span className={styles.grip} />
                <span className={styles.label}>
                  <Art slug={c.slug} />
                </span>
                <span className={styles.name}>{c.title}</span>
                {on && <span className={styles.arrow}>▼</span>}
              </>
            );
            const style = { ["--c" as string]: c.color };
            const cls = `${styles.cart} ${on ? styles.on : ""}`;
            return c.href ? (
              <a
                key={c.slug}
                href={c.href}
                className={cls}
                style={style}
                onPointerEnter={(e) => e.pointerType === "mouse" && choose(i)}
                onClick={(e) => {
                  if (!on) {
                    e.preventDefault();
                    choose(i);
                  }
                }}
              >
                {inner}
              </a>
            ) : (
              <button key={c.slug} type="button" className={cls} style={style} onClick={() => choose(i)} onPointerEnter={(e) => e.pointerType === "mouse" && choose(i)}>
                {inner}
              </button>
            );
          })}
        </section>

        <section className={styles.msg} aria-live="polite">
          <div className={styles.msgTitle}>{cur.title}</div>
          <p className={styles.msgText}>
            {typed}
            <i className={styles.caret} />
          </p>
          <div className={styles.msgFoot}>
            <ul className={styles.tags}>{cur.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            {cur.href ? (
              <a className={styles.btn} href={cur.href} onClick={() => addScore(500)}>
                ▶ START
              </a>
            ) : (
              <span className={`${styles.btn} ${styles.off}`}>NOT YET</span>
            )}
          </div>
          <p className={styles.keys}>← → えらぶ　ENTER あそぶ　SPACE ジャンプ</p>
        </section>

        <div className={styles.ground} onClick={doJump} role="presentation">
          <div className={`${styles.hero} ${jump ? styles.jump : ""}`}>
            <Sprite rows={RUNNER_A} palette={RUNNER_PALETTE} px={4} className={styles.frameA} />
            <Sprite rows={RUNNER_B} palette={RUNNER_PALETTE} px={4} className={styles.frameB} />
          </div>
          <span className={styles.coin} style={{ left: "22%" }} />
          <span className={styles.coin} style={{ left: "58%", animationDelay: "-.4s" }} />
          <span className={styles.coin} style={{ left: "83%", animationDelay: "-.8s" }} />
          <i className={styles.tiles} />
        </div>

        <footer className={styles.footer}>
          <Link href="/portfolio">作者について</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <span>© 2026 TAO MATSUMURA</span>
        </footer>
      </main>
    </div>
  );
}
