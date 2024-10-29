"use client";
import dynamic from "next/dynamic";

// クライアントサイドレンダリング専用のコンポーネントを動的にインポート
const UnityComponent = dynamic(
  () => import("../../components/unityComponent"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <div>
      <h1>Unity AR in Next.js</h1>
      <UnityComponent />
    </div>
  );
}
