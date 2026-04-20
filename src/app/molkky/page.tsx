"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "src/components/button";
import { db } from "src/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  limit,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import type {
  TurnScore,
  GameState,
  Project,
  MatchRecord,
  FirestoreGameRecord,
} from "./types";

// ─── constants ───────────────────────────────────────────────────────────────
const GAME_KEY = "molkky_game";
const SUSPENDED_KEY = "molkky_suspended";
const PROJECT_KEY = "molkky_project";
const MOLKKY_COL = "molkky_games";
const PROJECT_COL = "molkky_projects";
const RANK_LABEL = ["1位", "2位", "3位", "4位", "5位", "6位", "7位", "8位"];

// ─── helpers ─────────────────────────────────────────────────────────────────
const newId = () => Math.random().toString(36).slice(2);

const recalcTurns = (turns: TurnScore[], idx: number, newScore: number): TurnScore[] =>
  turns.map((t, i) => {
    const score = i === idx ? newScore : t.score;
    const prev = i === 0 ? 0 : 0; // 再計算は下で
    return { score, total: 0 };
  }).reduce<TurnScore[]>((acc, t, i) => {
    const prevTotal = i === 0 ? 0 : acc[i - 1].total;
    const raw = prevTotal + t.score;
    acc.push({ score: t.score, total: raw > 50 ? 25 : raw });
    return acc;
  }, []);

const trailingZeros = (turns: TurnScore[]): number => {
  let n = 0;
  for (let i = turns.length - 1; i >= 0; i--) {
    if (turns[i].score === 0) n++;
    else break;
  }
  return n;
};

const lastTotal = (turns: TurnScore[]): number =>
  turns.length > 0 ? turns[turns.length - 1].total : 0;

// アクティブ（ゴール・脱落していない）プレイヤーを返す
const getActive = (s: GameState): string[] =>
  s.playerOrder.filter((p) => {
    if (s.finishedPlayers.includes(p)) return false;
    if (!s.practiceMode && trailingZeros(s.data[p] ?? []) >= 2) return false;
    return true;
  });

// ビリ（最下位確定）: アクティブ1人 or 全員ゴール以外の最後
const getLoser = (s: GameState): string | null => {
  const active = getActive(s);
  if (active.length === 1) return active[0];
  // 全員ゴール or 全員脱落の中で最後に残った人
  const eliminated = s.playerOrder.filter(
    (p) => !s.finishedPlayers.includes(p) && trailingZeros(s.data[p] ?? []) >= 2
  );
  const notFinished = s.playerOrder.filter((p) => !s.finishedPlayers.includes(p));
  if (notFinished.length === 1) return notFinished[0];
  return null;
};

// ─── component ───────────────────────────────────────────────────────────────
export default function Page() {
  // ── game state ──────────────────────────────────────────────────────────
  const initGame = (): GameState => ({
    turns: 0,
    data: {},
    playerOrder: [],
    practiceMode: false,
    finishedPlayers: [],
    penaltyPhase: false,
    penaltyThrows: [],
    penaltyTarget: "",
    penaltyPayer: "",
  });

  const [game, setGame] = useState<GameState>(initGame);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [suspended, setSuspended] = useState<GameState | null>(null);

  // ── project state ───────────────────────────────────────────────────────
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoaded, setProjectLoaded] = useState(false);

  // ── setup UI state ──────────────────────────────────────────────────────
  const [setupTab, setSetupTab] = useState<"game" | "project" | "history">("game");
  const [newMemberName, setNewMemberName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [penaltyMode, setPenaltyMode] = useState(true);

  // ── gameplay UI state ───────────────────────────────────────────────────
  const [addScoreStr, setAddScoreStr] = useState("");
  const [penaltyScoreStr, setPenaltyScoreStr] = useState("");
  const [editCell, setEditCell] = useState<{ player: string; turnIndex: number } | null>(null);
  const [editStr, setEditStr] = useState("");

  // ── history ─────────────────────────────────────────────────────────────
  const [history, setHistory] = useState<FirestoreGameRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [histEditCell, setHistEditCell] = useState<{ id: string; player: string; turnIndex: number } | null>(null);
  const [histEditStr, setHistEditStr] = useState("");

  const scoreInputRef = useRef<HTMLInputElement>(null);
  const penaltyInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // ── derived ─────────────────────────────────────────────────────────────
  const players = game.playerOrder;
  const active = getActive(game);
  const nowPlayer = active.length > 0 ? active[game.turns % active.length] : "";
  const finishedPlayers = game.finishedPlayers;
  const loser = getLoser(game);
  const winner = finishedPlayers[0] ?? null;

  // 罰則モード: undefinedはtrue扱い（後方互換）
  const isPenaltyMode = game.penaltyMode !== false;

  // 1位とビリが確定したか（罰則フェーズ移行条件）
  const penaltyReady =
    isPenaltyMode &&
    winner !== null &&
    loser !== null &&
    winner !== loser &&
    !game.penaltyPhase &&
    (active.length === 1 || active.length === 0);

  const penaltyDone =
    game.penaltyPhase &&
    (game.penaltyThrows?.length ?? 0) >= 2;

  const allDone =
    active.length === 0 && !game.penaltyPhase;

  const maxTurns =
    players.length > 0
      ? Math.max(0, ...players.map((p) => game.data[p]?.length ?? 0))
      : 0;

  // ── load from localStorage ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const g = localStorage.getItem(GAME_KEY);
      if (g) {
        const parsed = JSON.parse(g) as GameState;
        if (!parsed.finishedPlayers) parsed.finishedPlayers = [];
        if (!parsed.penaltyThrows) parsed.penaltyThrows = [];
        setGame(parsed);
      }
    } catch {}
    try {
      const p = localStorage.getItem(PROJECT_KEY);
      if (p) setProject(JSON.parse(p) as Project);
    } catch {}
    try {
      const s = localStorage.getItem(SUSPENDED_KEY);
      if (s) setSuspended(JSON.parse(s) as GameState);
    } catch {}
    setGameLoaded(true);
    setProjectLoaded(true);
  }, []);

  useEffect(() => {
    if (!gameLoaded) return;
    localStorage.setItem(GAME_KEY, JSON.stringify(game));
  }, [game, gameLoaded]);

  useEffect(() => {
    if (!projectLoaded) return;
    localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
  }, [project, projectLoaded]);

  useEffect(() => {
    if (editCell) setTimeout(() => editInputRef.current?.focus(), 30);
  }, [editCell]);

  // ── score registration ───────────────────────────────────────────────────
  const registerScore = () => {
    const score = parseInt(addScoreStr, 10);
    if (isNaN(score) || score < 0 || score > 12) {
      alert("0〜12の数字を入力してください");
      return;
    }
    if (!nowPlayer) return;

    const prev = lastTotal(game.data[nowPlayer] ?? []);
    const raw = prev + score;
    const total = raw > 50 ? 25 : raw;

    const g: GameState = {
      ...game,
      data: {
        ...game.data,
        [nowPlayer]: [...(game.data[nowPlayer] ?? []), { score, total }],
      },
      finishedPlayers: [...game.finishedPlayers],
    };

    const zeros = trailingZeros(game.data[nowPlayer] ?? []) + (score === 0 ? 1 : 0);
    const prevActive = [...active];

    // 脱落
    if (!game.practiceMode && zeros >= 2) {
      g.data[nowPlayer] = [
        ...g.data[nowPlayer].slice(0, -1),
        { score: 0, total: 0 },
      ];
      g.turns = nextTurns(g, prevActive, nowPlayer);
      setAddScoreStr("");
      setGame(g);
      return;
    }

    // ゴール
    if (total === 50) {
      g.finishedPlayers = [...g.finishedPlayers, nowPlayer];
      g.turns = nextTurns(g, prevActive, nowPlayer);
      setAddScoreStr("");
      // 1位・ビリ確定チェック
      const newActive = getActive(g);
      const newLoser = getLoser(g);
      if (
        (g.penaltyMode !== false) &&
        g.finishedPlayers.length >= 1 &&
        newLoser &&
        (newActive.length === 1 || newActive.length === 0)
      ) {
        // 罰則フェーズへ
        g.penaltyPhase = true;
        g.penaltyThrows = [];
        g.penaltyTarget = newLoser;
        g.penaltyPayer = newLoser;
      }
      setGame(g);
      return;
    }

    g.turns = nextTurns(g, prevActive, nowPlayer);
    setAddScoreStr("");
    setGame(g);
    setTimeout(() => scoreInputRef.current?.focus(), 50);
  };

  // turns を進めてアクティブプレイヤーを正しく選ぶ
  // 現在のプレイヤーが active から抜けた（ゴール/脱落）場合は turns を変えない
  // → active が縮んだ後も turns % newActive.length が正しい次のプレイヤーを指す
  const nextTurns = (g: GameState, prevActive: string[], prevPlayer: string): number => {
    const newActive = getActive(g);
    if (newActive.length === 0) return g.turns;
    // prevPlayer が newActive にいる → まだ残っている（通常の次ターン）
    if (newActive.includes(prevPlayer)) return g.turns + 1;
    // prevPlayer が抜けた → turns はそのまま（active 縮小で次が自動的に正しくなる）
    return g.turns;
  };

  // ── penalty phase ────────────────────────────────────────────────────────
  const registerPenaltyThrow = () => {
    const score = parseInt(penaltyScoreStr, 10);
    if (isNaN(score) || score < 0 || score > 12) {
      alert("0〜12の数字を入力してください");
      return;
    }
    const throws = [...(game.penaltyThrows ?? []), score];
    const g: GameState = { ...game, penaltyThrows: throws };

    if (throws.length >= 2) {
      // 罰則確定 → 試合記録を保存
      g.penaltyPhase = false;
      const penaltyPoints = throws[0] + throws[1];
      savePenaltyRecord(g, penaltyPoints, throws);
      // 終了扱い: 中断データをクリア
      localStorage.removeItem(SUSPENDED_KEY);
      setSuspended(null);
    }

    setPenaltyScoreStr("");
    setGame(g);
  };

  // ── undo ─────────────────────────────────────────────────────────────────
  const undoLastTurn = () => {
    if (game.penaltyPhase) {
      // 罰則フェーズ中のundo
      const throws = game.penaltyThrows ?? [];
      if (throws.length > 0) {
        setGame({ ...game, penaltyThrows: throws.slice(0, -1) });
      } else {
        // 罰則フェーズ自体を取り消す
        setGame({ ...game, penaltyPhase: false, penaltyThrows: [], penaltyTarget: "", penaltyPayer: "" });
      }
      return;
    }
    if (game.turns === 0) return;

    const g: GameState = {
      ...game,
      data: { ...game.data },
      finishedPlayers: [...game.finishedPlayers],
    };

    // 直前のプレイヤーを特定: turns-1 の状態でnowPlayerを計算
    const prevTurns = game.turns - 1;
    const prevLastFinished = g.finishedPlayers[g.finishedPlayers.length - 1];
    // 直前はfinishedが1人少ない状態
    const tempFinished = prevLastFinished
      ? g.finishedPlayers.slice(0, -1)
      : g.finishedPlayers;
    const tempActive = g.playerOrder.filter((p) => {
      if (tempFinished.includes(p)) return false;
      if (!g.practiceMode && trailingZeros(g.data[p] ?? []) >= 2) return false;
      return true;
    });
    const prevPlayer =
      tempActive.length > 0 ? tempActive[prevTurns % tempActive.length] : "";

    if (prevPlayer && g.data[prevPlayer]?.length > 0) {
      g.data[prevPlayer] = g.data[prevPlayer].slice(0, -1);
    }
    if (prevLastFinished === prevPlayer) {
      g.finishedPlayers = g.finishedPlayers.slice(0, -1);
    }
    g.turns = prevTurns;
    setGame(g);
    setTimeout(() => scoreInputRef.current?.focus(), 50);
  };

  // ── edit cell ────────────────────────────────────────────────────────────
  const commitEdit = () => {
    if (!editCell) return;
    const score = parseInt(editStr, 10);
    if (isNaN(score) || score < 0 || score > 12) { setEditCell(null); return; }
    const g: GameState = { ...game, data: { ...game.data } };
    g.data[editCell.player] = recalcTurns(g.data[editCell.player], editCell.turnIndex, score);
    setEditCell(null);
    setGame(g);
  };

  // ── save records ──────────────────────────────────────────────────────────
  const savePenaltyRecord = async (g: GameState, penaltyPoints: number, throws: number[]) => {
    const record: FirestoreGameRecord = {
      winner: g.finishedPlayers[0] ?? "",
      loser: g.penaltyTarget ?? "",
      players: g.playerOrder,
      finalScores: Object.fromEntries(
        g.playerOrder.map((p) => [p, lastTotal(g.data[p] ?? [])])
      ),
      turnData: g.data,
      penaltyPoints,
      penaltyBreakdown: throws,
      projectId: project?.id,
      createdAt: Timestamp.now(),
    };
    try {
      await addDoc(collection(db, MOLKKY_COL), record);
    } catch {}

    // プロジェクトに記録
    if (project) {
      const match: MatchRecord = {
        id: newId(),
        participants: g.playerOrder,
        winner: g.finishedPlayers[0] ?? "",
        loser: g.penaltyTarget ?? "",
        penaltyPoints,
        penaltyBreakdown: throws,
        createdAt: Date.now(),
      };
      const updated: Project = { ...project, matches: [...project.matches, match] };
      setProject(updated);
    }
  };

  // ── history ──────────────────────────────────────────────────────────────
  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const q = query(collection(db, MOLKKY_COL), orderBy("createdAt", "desc"), limit(20));
      const snap = await getDocs(q);
      setHistory(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FirestoreGameRecord, "id">) })));
    } catch {}
    setHistoryLoading(false);
  };

  // ── history cell edit ────────────────────────────────────────────────────
  const commitHistEdit = async () => {
    if (!histEditCell) return;
    const score = parseInt(histEditStr, 10);
    if (isNaN(score) || score < 0 || score > 12) { setHistEditCell(null); return; }
    const { id, player, turnIndex } = histEditCell;

    setHistory((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const newTurnData = { ...(r.turnData ?? {}) };
      newTurnData[player] = recalcTurns(newTurnData[player] ?? [], turnIndex, score);
      const newFinalScores = { ...r.finalScores };
      const turns = newTurnData[player];
      newFinalScores[player] = turns.length > 0 ? turns[turns.length - 1].total : 0;
      return { ...r, turnData: newTurnData, finalScores: newFinalScores };
    }));

    // Firestoreにも保存
    try {
      const updated = history.find((r) => r.id === id);
      if (updated) {
        const newTurnData = { ...(updated.turnData ?? {}) };
        newTurnData[player] = recalcTurns(newTurnData[player] ?? [], turnIndex, score);
        const newFinalScores = { ...updated.finalScores };
        const turns = newTurnData[player];
        newFinalScores[player] = turns.length > 0 ? turns[turns.length - 1].total : 0;
        await updateDoc(doc(collection(db, MOLKKY_COL), id), {
          turnData: newTurnData,
          finalScores: newFinalScores,
        });
      }
    } catch {}
    setHistEditCell(null);
  };

  // ── project management ───────────────────────────────────────────────────
  const createProject = () => {
    const n = newProjectName.trim();
    if (!n) return;
    const p: Project = { id: newId(), name: n, members: [], matches: [], createdAt: Date.now() };
    setProject(p);
    setNewProjectName("");
    setSelectedParticipants([]);
  };

  const addMember = () => {
    const n = newMemberName.trim();
    if (!n || !project || project.members.includes(n)) return;
    const updated = { ...project, members: [...project.members, n] };
    setProject(updated);
    setSelectedParticipants((prev) => [...prev, n]);
    setNewMemberName("");
  };

  const removeMember = (m: string) => {
    if (!project) return;
    setProject({ ...project, members: project.members.filter((x) => x !== m) });
    setSelectedParticipants((prev) => prev.filter((x) => x !== m));
  };

  const toggleParticipant = (m: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  // ── finish game (non-suspend) ─────────────────────────────────────────────
  const finishGame = (keepPlayers: boolean) => {
    localStorage.removeItem(SUSPENDED_KEY);
    setSuspended(null);
    resetGame(keepPlayers, false);
  };

  // ── game reset / start ────────────────────────────────────────────────────
  const startGame = (participants: string[]) => {
    if (participants.length < 2) return;
    const g = initGame();
    g.playerOrder = [...participants];
    g.practiceMode = practiceMode;
    g.penaltyMode = penaltyMode;
    participants.forEach((p) => { g.data[p] = []; });
    setGame(g);
    setAddScoreStr("");
  };

  const resetGame = (keepPlayers: boolean, suspend = false) => {
    if (suspend) {
      localStorage.setItem(SUSPENDED_KEY, JSON.stringify(game));
      setSuspended(game);
    } else {
      localStorage.removeItem(SUSPENDED_KEY);
      setSuspended(null);
    }
    if (keepPlayers) {
      const g = initGame();
      g.playerOrder = [...players];
      g.practiceMode = game.practiceMode;
      players.forEach((p) => { g.data[p] = []; });
      setGame(g);
    } else {
      setGame(initGame());
    }
    setAddScoreStr("");
  };

  const resumeGame = () => {
    if (!suspended) return;
    // turns % active.length が正しい次プレイヤーを指すよう正規化する
    const activeOnResume = getActive(suspended);
    const g =
      activeOnResume.length > 0
        ? { ...suspended, turns: suspended.turns % activeOnResume.length }
        : suspended;
    setGame(g);
    localStorage.removeItem(SUSPENDED_KEY);
    setSuspended(null);
  };

  // ── rank helpers ──────────────────────────────────────────────────────────
  const getRank = (p: string) => {
    const i = finishedPlayers.indexOf(p);
    if (i >= 0) return RANK_LABEL[i] ?? `${i + 1}位`;
    const isElim = !game.practiceMode && trailingZeros(game.data[p] ?? []) >= 2;
    if (isElim) return "脱落";
    return null;
  };

  const isSetup = players.length === 0;
  const penaltyPoints = (game.penaltyThrows ?? []).reduce((a, b) => a + b, 0);

  // ── project totals ───────────────────────────────────────────────────────
  const memberTotals = project
    ? Object.fromEntries(
        project.members.map((m) => [
          m,
          project.matches.reduce((sum, match) => {
            if (match.loser === m) return sum + match.penaltyPoints;
            return sum;
          }, 0),
        ])
      )
    : {};

  // ─── render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-molkky">
      {isSetup ? (
        /* ═══════════════ SETUP ═══════════════ */
        <>
          <div className="p-molkky__tabs">
            {(["game", "project", "history"] as const).map((t) => (
              <button
                key={t}
                className={`p-molkky__tab ${setupTab === t ? "is-active" : ""}`}
                onClick={() => {
                  setSetupTab(t);
                  if (t === "history") loadHistory();
                }}
              >
                {t === "game" ? "ゲーム" : t === "project" ? "プロジェクト" : "履歴"}
              </button>
            ))}
          </div>

          {setupTab === "game" && (
            <div className="p-molkky__setup-body">
              <div className="p-molkky__title">ゲーム設定</div>

              {suspended && (
                <div className="p-molkky__resume-banner">
                  <div className="p-molkky__resume-info">
                    中断中のゲームがあります（{suspended.playerOrder.join(" / ")}）
                  </div>
                  <Button
                    label="再開する"
                    addClass="p-molkky__resume-btn"
                    onClick={resumeGame}
                  />
                  <button
                    className="p-molkky__resume-discard"
                    onClick={() => {
                      if (confirm("中断データを削除しますか？")) {
                        localStorage.removeItem(SUSPENDED_KEY);
                        setSuspended(null);
                      }
                    }}
                  >
                    破棄
                  </button>
                </div>
              )}

              {project ? (
                /* プロジェクトメンバーから参加者選択 */
                <>
                  <div className="p-molkky__input-name-label">
                    プロジェクト: {project.name}
                  </div>
                  <div className="p-molkky__input-users-label">投げる順番（タップで選択、▲▼で並び替え）</div>
                  <ul className="p-molkky__users">
                    {/* 選択済み: selectedParticipants の順で表示 */}
                    {selectedParticipants.map((m, selIdx) => (
                      <li
                        key={m}
                        className="p-molkky__user-column is-selected"
                        onClick={() => toggleParticipant(m)}
                      >
                        <span className="p-molkky__user-check">✓</span>
                        <span className="p-molkky__user-order">{selIdx + 1}.</span>
                        <span className="p-molkky__user-name">{m}</span>
                        <div className="p-molkky__user-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="p-molkky__order-btn"
                            disabled={selIdx === 0}
                            onClick={() => setSelectedParticipants((prev) => {
                              const next = [...prev];
                              [next[selIdx - 1], next[selIdx]] = [next[selIdx], next[selIdx - 1]];
                              return next;
                            })}
                          >▲</button>
                          <button
                            className="p-molkky__order-btn"
                            disabled={selIdx === selectedParticipants.length - 1}
                            onClick={() => setSelectedParticipants((prev) => {
                              const next = [...prev];
                              [next[selIdx], next[selIdx + 1]] = [next[selIdx + 1], next[selIdx]];
                              return next;
                            })}
                          >▼</button>
                        </div>
                      </li>
                    ))}
                    {/* 未選択メンバー */}
                    {project.members.filter((m) => !selectedParticipants.includes(m)).map((m) => (
                      <li
                        key={m}
                        className="p-molkky__user-column"
                        onClick={() => toggleParticipant(m)}
                      >
                        <span className="p-molkky__user-check">　</span>
                        <span className="p-molkky__user-order" />
                        <span className="p-molkky__user-name">{m}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                /* プロジェクトなし: 直接入力 */
                <>
                  <div className="p-molkky__input-name-label">ユーザー名</div>
                  <input
                    className="p-molkky__input-name"
                    placeholder="user name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        const n = newMemberName.trim();
                        if (!n || selectedParticipants.includes(n)) return;
                        setSelectedParticipants((prev) => [...prev, n]);
                        setNewMemberName("");
                      }
                    }}
                  />
                  <Button
                    addClass="p-molkky__add"
                    label="追加"
                    onClick={() => {
                      const n = newMemberName.trim();
                      if (!n || selectedParticipants.includes(n)) return;
                      setSelectedParticipants((prev) => [...prev, n]);
                      setNewMemberName("");
                    }}
                  />
                  <div className="p-molkky__input-users-label">参加者一覧</div>
                  <ul className="p-molkky__users">
                    {selectedParticipants.map((n, i) => (
                      <li className="p-molkky__user-column" key={i}>
                        <span className="p-molkky__user-name">{n}</span>
                        <div className="p-molkky__user-actions">
                          <button
                            className="p-molkky__order-btn"
                            disabled={i === 0}
                            onClick={() => setSelectedParticipants((prev) => {
                              const next = [...prev];
                              [next[i - 1], next[i]] = [next[i], next[i - 1]];
                              return next;
                            })}
                          >▲</button>
                          <button
                            className="p-molkky__order-btn"
                            disabled={i === selectedParticipants.length - 1}
                            onClick={() => setSelectedParticipants((prev) => {
                              const next = [...prev];
                              [next[i], next[i + 1]] = [next[i + 1], next[i]];
                              return next;
                            })}
                          >▼</button>
                          <button
                            className="p-molkky__delete-btn"
                            onClick={() => setSelectedParticipants((prev) => prev.filter((_, j) => j !== i))}
                          >
                            ✕
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <label className="p-molkky__practice-label">
                <input
                  type="checkbox"
                  className="p-molkky__practice-check"
                  checked={practiceMode}
                  onChange={(e) => setPracticeMode(e.target.checked)}
                />
                練習モード（0連続でも脱落なし）
              </label>
              <label className="p-molkky__practice-label">
                <input
                  type="checkbox"
                  className="p-molkky__practice-check"
                  checked={penaltyMode}
                  onChange={(e) => setPenaltyMode(e.target.checked)}
                />
                罰則投げあり（1位がビリのために2投）
              </label>
              <Button
                label={`開始${selectedParticipants.length < 2 ? "（2人以上必要）" : ""}`}
                addClass="p-molkky__start"
                onClick={() => {
                  if (selectedParticipants.length < 2) return;
                  startGame(selectedParticipants);
                }}
              />
            </div>
          )}

          {setupTab === "project" && (
            <div className="p-molkky__setup-body">
              {project ? (
                <>
                  <div className="p-molkky__title">{project.name}</div>

                  {/* メンバー追加 */}
                  <div className="p-molkky__input-name-label">メンバーを追加</div>
                  <input
                    className="p-molkky__input-name"
                    placeholder="member name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) addMember();
                    }}
                  />
                  <Button addClass="p-molkky__add" label="追加" onClick={addMember} />

                  <div className="p-molkky__input-users-label">メンバー</div>
                  <ul className="p-molkky__users">
                    {project.members.map((m) => (
                      <li className="p-molkky__user-column" key={m}>
                        <span className="p-molkky__user-name">{m}</span>
                        <button className="p-molkky__delete-btn" onClick={() => removeMember(m)}>✕</button>
                      </li>
                    ))}
                  </ul>

                  {/* 支払いポイント集計 */}
                  {project.matches.length > 0 && (
                    <>
                      <div className="p-molkky__input-users-label">支払いポイント集計</div>
                      <div className="p-molkky__penalty-totals">
                        {project.members
                          .slice()
                          .sort((a, b) => (memberTotals[b] ?? 0) - (memberTotals[a] ?? 0))
                          .map((m) => (
                            <div key={m} className="p-molkky__penalty-row">
                              <span className="p-molkky__penalty-name">{m}</span>
                              <span className="p-molkky__penalty-pts">{memberTotals[m] ?? 0} pt</span>
                            </div>
                          ))}
                      </div>

                      <div className="p-molkky__input-users-label">試合履歴</div>
                      <ul className="p-molkky__history-list">
                        {project.matches
                          .slice()
                          .reverse()
                          .map((m) => (
                            <li key={m.id} className="p-molkky__history-item">
                              <div className="p-molkky__history-winner">🏆 {m.winner}</div>
                              <div className="p-molkky__history-date">
                                {new Date(m.createdAt).toLocaleDateString("ja-JP", {
                                  month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
                                })}
                              </div>
                              <div className="p-molkky__history-scores">
                                <span className="p-molkky__history-score">
                                  罰則: {m.loser} → {m.penaltyPoints}pt ({m.penaltyBreakdown.join(" + ")})
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </>
                  )}

                  <Button
                    label="プロジェクトを削除"
                    addClass="p-molkky__score-end"
                    onClick={() => {
                      if (confirm("プロジェクトを削除しますか？")) {
                        setProject(null);
                        setSelectedParticipants([]);
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="p-molkky__title">プロジェクト作成</div>
                  <div className="p-molkky__input-name-label">プロジェクト名</div>
                  <input
                    className="p-molkky__input-name"
                    placeholder="project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) createProject();
                    }}
                  />
                  <Button addClass="p-molkky__start" label="作成" onClick={createProject} />
                </>
              )}
            </div>
          )}

          {setupTab === "history" && (
            <div className="p-molkky__history">
              <div className="p-molkky__title">履歴</div>
              {historyLoading ? (
                <div className="p-molkky__history-loading">読み込み中...</div>
              ) : history.length === 0 ? (
                <div className="p-molkky__history-empty">記録がありません</div>
              ) : (
                <ul className="p-molkky__history-list">
                  {history.map((r, i) => {
                    const rid = r.id ?? String(i);
                    const isExpanded = expandedHistoryId === rid;
                    const canAddToProject =
                      project !== null &&
                      r.projectId !== project.id;
                    return (
                      <li
                        key={rid}
                        className={`p-molkky__history-item p-molkky__history-item--clickable${isExpanded ? " is-expanded" : ""}`}
                        onClick={() => setExpandedHistoryId(isExpanded ? null : rid)}
                      >
                        <div className="p-molkky__history-winner">🏆 {r.winner}</div>
                        <div className="p-molkky__history-date">
                          {r.createdAt
                            ? new Date(r.createdAt.seconds * 1000).toLocaleDateString("ja-JP", {
                                year: "numeric", month: "2-digit", day: "2-digit",
                                hour: "2-digit", minute: "2-digit",
                              })
                            : ""}
                        </div>
                        {isExpanded && (
                          <div onClick={(e) => e.stopPropagation()}>
                            {r.turnData ? (
                              /* ターン詳細テーブル */
                              <div className="p-molkky__hist-table-wrap">
                                <table className="p-molkky__hist-table">
                                  <thead>
                                    <tr>
                                      <th className="p-molkky__hist-th-name">名前</th>
                                      {Array.from({
                                        length: Math.max(0, ...Object.values(r.turnData).map((t) => t.length)),
                                      }).map((_, i) => (
                                        <th key={i} className="p-molkky__hist-th-turn">{i + 1}</th>
                                      ))}
                                      <th className="p-molkky__hist-th-total">計</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(r.players ?? []).map((p) => {
                                      const turns = r.turnData?.[p] ?? [];
                                      const maxT = Math.max(0, ...Object.values(r.turnData ?? {}).map((t) => t.length));
                                      return (
                                        <tr key={p}>
                                          <td className="p-molkky__hist-td-name">{p}</td>
                                          {Array.from({ length: maxT }).map((_, i) => {
                                            const t = turns[i];
                                            const isEditing = histEditCell?.id === rid && histEditCell.player === p && histEditCell.turnIndex === i;
                                            if (!t) return <td key={i} className="p-molkky__hist-td-turn" />;
                                            return (
                                              <td
                                                key={i}
                                                className="p-molkky__hist-td-turn"
                                                onDoubleClick={() => { setHistEditCell({ id: rid, player: p, turnIndex: i }); setHistEditStr(String(t.score)); }}
                                              >
                                                {isEditing ? (
                                                  <input
                                                    className="p-molkky__edit-input"
                                                    type="number"
                                                    inputMode="numeric"
                                                    autoFocus
                                                    value={histEditStr}
                                                    onChange={(e) => setHistEditStr(e.target.value)}
                                                    onKeyDown={(e) => {
                                                      if (e.key === "Enter") commitHistEdit();
                                                      if (e.key === "Escape") setHistEditCell(null);
                                                    }}
                                                    onBlur={commitHistEdit}
                                                  />
                                                ) : (
                                                  <>
                                                    <div className="p-molkky__cell-score">{t.score}</div>
                                                    <div className="p-molkky__cell-total">{t.total}</div>
                                                  </>
                                                )}
                                              </td>
                                            );
                                          })}
                                          <td className="p-molkky__hist-td-total">{r.finalScores?.[p] ?? "-"}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              /* 旧データ: スコアのみ */
                              <div className="p-molkky__history-scores">
                                {r.players?.map((p) => (
                                  <span key={p} className="p-molkky__history-score">
                                    {p}: {r.finalScores?.[p] ?? "-"}
                                  </span>
                                ))}
                              </div>
                            )}
                            {r.penaltyPoints > 0 && (
                              <div className="p-molkky__history-score p-molkky__history-score--penalty" style={{ marginTop: 8 }}>
                                💸 罰則: {r.loser} {r.penaltyPoints}pt
                                {r.penaltyBreakdown && r.penaltyBreakdown.length > 0 && ` (${r.penaltyBreakdown.join(" + ")})`}
                              </div>
                            )}
                            {canAddToProject && (
                              <button
                                className="p-molkky__history-add-pj-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!project) return;
                                  const match: MatchRecord = {
                                    id: r.id ?? newId(),
                                    participants: r.players ?? [],
                                    winner: r.winner,
                                    loser: r.loser,
                                    penaltyPoints: r.penaltyPoints,
                                    penaltyBreakdown: r.penaltyBreakdown ?? [],
                                    createdAt: r.createdAt ? r.createdAt.seconds * 1000 : Date.now(),
                                  };
                                  setProject({ ...project, matches: [...project.matches, match] });
                                }}
                              >
                                このPJに追加
                              </button>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        /* ═══════════════ GAMEPLAY ═══════════════ */
        <div className="p-molkky__playing">
          {/* ── menu bar ── */}
          <div className="p-molkky__menu">
            <div className="p-molkky__menu-top">
              {penaltyReady || game.penaltyPhase ? (
                <div className="p-molkky__now-player p-molkky__now-player--penalty">
                  🎯 罰則: {winner}が投げる
                </div>
              ) : allDone ? (
                <div className="p-molkky__win-player">ゲーム終了！</div>
              ) : (
                <div className="p-molkky__now-player">
                  {nowPlayer}の番です
                  {game.practiceMode && <span className="p-molkky__practice-badge">練習</span>}
                </div>
              )}
              <button
                className="p-molkky__undo-btn"
                onClick={undoLastTurn}
                disabled={game.turns === 0 && !(game.penaltyThrows ?? []).length}
                title="1手戻す"
              >
                ↩ 戻す
              </button>
              <Button
                label="トップへ"
                addClass="p-molkky__score-end"
                onClick={() => { if (confirm("ゲームを中断して保存しますか？")) resetGame(false, true); }}
              />
            </div>

            {game.penaltyPhase && !penaltyDone ? (
              /* 罰則投げ入力 */
              <div className="p-molkky__menu-bottom">
                <div className="p-molkky__penalty-label">
                  {(game.penaltyThrows ?? []).length + 1}投目 / 2投
                </div>
                <input
                  ref={penaltyInputRef}
                  className="p-molkky__score-input"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={12}
                  placeholder="点数"
                  value={penaltyScoreStr}
                  onChange={(e) => setPenaltyScoreStr(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") registerPenaltyThrow(); }}
                  autoFocus
                />
                <Button label="登録" addClass="p-molkky__score-add" onClick={registerPenaltyThrow} />
              </div>
            ) : penaltyDone ? (
              /* 罰則確定後 */
              <div className="p-molkky__menu-bottom">
                <div className="p-molkky__penalty-result">
                  💸 {game.penaltyTarget} の支払い: {penaltyPoints}pt
                  （{(game.penaltyThrows ?? []).join(" + ")}）
                </div>
                <Button label="もう一度" addClass="p-molkky__score-add u-wt u-bg-bl" onClick={() => finishGame(true)} />
                <Button label="トップへ" addClass="p-molkky__score-continue" onClick={() => finishGame(false)} />
              </div>
            ) : allDone ? (
              <div className="p-molkky__menu-bottom">
                <Button label="もう一度" addClass="p-molkky__score-add u-wt u-bg-bl" onClick={() => finishGame(true)} />
                <Button label="トップへ" addClass="p-molkky__score-continue" onClick={() => finishGame(false)} />
              </div>
            ) : (
              /* 通常入力 */
              <div className="p-molkky__menu-bottom">
                <input
                  ref={scoreInputRef}
                  className="p-molkky__score-input"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={12}
                  placeholder="スコア"
                  value={addScoreStr}
                  onChange={(e) => setAddScoreStr(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") registerScore(); }}
                  autoFocus
                />
                <Button label="登録" addClass="p-molkky__score-add" onClick={registerScore} />
              </div>
            )}
          </div>

          {/* ── score table ── */}
          <div className="p-molkky__table-wrap">
            <table className="p-molkky__table">
              <thead>
                <tr>
                  <th className="p-molkky__th-rank">順位</th>
                  <th className="p-molkky__th-name">名前</th>
                  {Array.from({ length: maxTurns }).map((_, i) => (
                    <th key={i} className="p-molkky__th-turn">{i + 1}</th>
                  ))}
                  <th className="p-molkky__th-total">計</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => {
                  const turns = game.data[p] ?? [];
                  const elim = !game.practiceMode && trailingZeros(turns) >= 2;
                  const goaled = finishedPlayers.includes(p);
                  const rank = getRank(p);
                  const isCurrent = p === nowPlayer && !game.penaltyPhase && active.length > 0;
                  return (
                    <tr
                      key={p}
                      className={[
                        "p-molkky__tr",
                        isCurrent ? "is-current" : "",
                        elim ? "is-eliminated" : "",
                        goaled ? "is-goaled" : "",
                      ].join(" ")}
                    >
                      <td className="p-molkky__td-rank">
                        {rank && (
                          <span className={`p-molkky__rank-badge ${elim ? "rank-out" : `rank-${finishedPlayers.indexOf(p) + 1}`}`}>
                            {rank}
                          </span>
                        )}
                      </td>
                      <td className="p-molkky__td-name">{p}</td>
                      {Array.from({ length: maxTurns }).map((_, i) => {
                        const t = turns[i];
                        if (!t) return <td key={i} className="p-molkky__td-turn is-empty" />;
                        const prevZero = i > 0 && turns[i - 1].score === 0;
                        const isEditing = editCell?.player === p && editCell?.turnIndex === i;
                        const cls = t.score === 0
                          ? prevZero ? "is-miss-2" : "is-miss-1"
                          : 50 - t.total <= 12 ? "u-re" : "";
                        return (
                          <td
                            key={i}
                            className={`p-molkky__td-turn ${cls}`}
                            onDoubleClick={() => { setEditCell({ player: p, turnIndex: i }); setEditStr(String(t.score)); }}
                          >
                            {isEditing ? (
                              <input
                                ref={editInputRef}
                                className="p-molkky__edit-input"
                                type="number"
                                inputMode="numeric"
                                value={editStr}
                                onChange={(e) => setEditStr(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitEdit();
                                  if (e.key === "Escape") setEditCell(null);
                                }}
                                onBlur={commitEdit}
                              />
                            ) : (
                              <>
                                <div className="p-molkky__cell-score">{t.score}</div>
                                <div className="p-molkky__cell-total">{t.total}</div>
                              </>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-molkky__td-total">{lastTotal(turns)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ── 罰則フェーズテーブル ── */}
            {(game.penaltyPhase || penaltyDone) && (
              <div className="p-molkky__penalty-section">
                <div className="p-molkky__penalty-title">
                  🎯 罰則投げ（{winner} → {game.penaltyTarget}）
                </div>
                <table className="p-molkky__penalty-table">
                  <thead>
                    <tr>
                      <th>1投目</th>
                      <th>2投目</th>
                      <th>合計</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{(game.penaltyThrows ?? [])[0] ?? "−"}</td>
                      <td>{(game.penaltyThrows ?? [])[1] ?? "−"}</td>
                      <td className="p-molkky__penalty-sum">
                        {penaltyDone ? penaltyPoints : "−"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
