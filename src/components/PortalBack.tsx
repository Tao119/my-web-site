import Link from "next/link";

/** 各ゲームの画面から、ゲーム一覧(/games)へ戻るための小さなリンク。 */
export default function PortalBack() {
  return (
    <Link
      href="/games"
      aria-label="ゲーム一覧へ戻る"
      style={{
        position: "fixed",
        left: 8,
        bottom: 8,
        zIndex: 60,
        padding: "6px 10px",
        background: "rgba(11,18,48,.88)",
        color: "#fbbf24",
        border: "2px solid #000",
        boxShadow: "3px 3px 0 #000",
        font: "700 12px/1 ui-monospace, Menlo, monospace",
        letterSpacing: ".08em",
        textDecoration: "none",
      }}
    >
      ‹ TAO ARCADE
    </Link>
  );
}
