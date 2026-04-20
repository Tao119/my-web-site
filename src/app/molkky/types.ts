import { Timestamp } from "firebase/firestore";

export type TurnScore = {
  score: number;
  total: number;
};

export type GameState = {
  turns: number;
  data: { [name: string]: TurnScore[] };
  playerOrder: string[];
  practiceMode: boolean;
  penaltyMode?: boolean;    // 罰則投げあり（undefinedはtrue扱い）
  // ゴール順（1位から）
  finishedPlayers: string[];
  // 罰則フェーズ: 1位が投げた2投の点数
  penaltyPhase?: boolean;
  penaltyThrows?: number[]; // 最大2要素
  penaltyTarget?: string;   // ビリプレイヤー
  penaltyPayer?: string;    // 支払者（ビリ）= penaltyTarget
};

export type Project = {
  id: string;
  name: string;
  members: string[];
  // 試合ごとの支払い記録
  matches: MatchRecord[];
  createdAt: number;
};

export type MatchRecord = {
  id: string;
  participants: string[];
  winner: string;
  loser: string;
  // loserが支払うポイント（1位の2投の合計）
  penaltyPoints: number;
  penaltyBreakdown: number[]; // 2投の内訳
  createdAt: number;
};

export type FirestoreGameRecord = {
  id?: string;
  winner: string;
  loser: string;
  players: string[];
  finalScores: { [name: string]: number };
  penaltyPoints: number;
  projectId?: string;
  createdAt: Timestamp | null;
};
