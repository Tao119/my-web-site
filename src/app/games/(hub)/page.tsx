import { visibleGames } from "src/lib/games";
import HubClient from "./HubClient";

export const metadata = {
  title: "Tao Games | ブラウザで遊べるゲーム集",
  description: "松村タオが作った、ブラウザですぐ遊べるゲームの集まり。SHIBUYA RUSH、DOPAMINEなど。",
};

export default function Page() {
  return <HubClient games={visibleGames} />;
}
