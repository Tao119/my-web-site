import { DotGothic16, Press_Start_2P } from "next/font/google";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--f-pixel", display: "swap" });
const dot = DotGothic16({ weight: "400", subsets: ["latin"], variable: "--f-dot", display: "swap", preload: false });

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${pixel.variable} ${dot.variable}`} style={{ width: "100%", alignSelf: "flex-start" }}>{children}</div>;
}
