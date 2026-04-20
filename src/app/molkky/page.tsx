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
} from "firebase/firestore";

const APP_KEY = "molkky";
const MOLKKY_COLLECTION = "molkky_games";

type TurnScore = {
  score: number;
  total: number;
};

type Molkky = {
  turns: number;
  data: {
    [name: string]: TurnScore[];
  };
  playerOrder: string[];
  practiceMode?: boolean;
};

type GameRecord = {
  id?: string;
  winner: string;
  players: string[];
  finalScores: { [name: string]: number };
  createdAt: Timestamp | null;
};

const Page = () => {
  const [appState, setAppState] = useState<string | null>("");
  const [state, setState] = useState<Molkky>({
    turns: 0,
    data: {},
    playerOrder: [],
  });
  const [name, setName] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [addScoreStr, setAddScoreStr] = useState("");
  const [finish, setFinish] = useState(false);
  const [winner, setWinner] = useState("");
  const [tab, setTab] = useState<"game" | "history">("game");
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const scoreInputRef = useRef<HTMLInputElement>(null);

  const players = state.playerOrder.length > 0 ? state.playerOrder : [];
  const num = players.length;
  const nowPlayer = num > 0 ? players[state.turns % num] : "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppState(localStorage.getItem(APP_KEY));
    }
  }, []);

  useEffect(() => {
    if (appState) {
      try {
        const parsed = JSON.parse(appState) as Molkky;
        if (!parsed.playerOrder) {
          parsed.playerOrder = Object.keys(parsed.data);
        }
        setState(parsed);
      } catch {}
    }
  }, [appState]);

  useEffect(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(state));
  }, [state]);

  const getLastTotal = (player: string): number => {
    const turns = state.data[player];
    if (!turns || turns.length === 0) return 0;
    return turns[turns.length - 1].total;
  };

  const getLastScore = (player: string): number | null => {
    const turns = state.data[player];
    if (!turns || turns.length === 0) return null;
    return turns[turns.length - 1].score;
  };

  const getConsecutiveZeros = (player: string): number => {
    const turns = state.data[player];
    if (!turns || turns.length === 0) return 0;
    let count = 0;
    for (let i = turns.length - 1; i >= 0; i--) {
      if (turns[i].score === 0) count++;
      else break;
    }
    return count;
  };

  const registerScore = () => {
    const addScore = parseInt(addScoreStr, 10);
    if (isNaN(addScore)) return;
    if (addScore < 0 || addScore > 12) {
      alert("0~12の数字を入力してください");
      return;
    }

    const s: Molkky = {
      ...state,
      data: { ...state.data },
    };

    const currentTotal = getLastTotal(nowPlayer);
    const newTotal = currentTotal + addScore;
    const finalTotal = newTotal > 50 ? 25 : newTotal;

    const newTurn: TurnScore = { score: addScore, total: finalTotal };
    s.data[nowPlayer] = [...(s.data[nowPlayer] || []), newTurn];

    const consecutiveZeros = getConsecutiveZeros(nowPlayer) + (addScore === 0 ? 1 : 0);

    if (!state.practiceMode && consecutiveZeros >= 2) {
      s.data[nowPlayer][s.data[nowPlayer].length - 1] = { score: 0, total: 0 };
      s.turns = state.turns + 1;
      setAddScoreStr("");
      setState(s);
      return;
    }

    if (finalTotal === 50) {
      setWinner(nowPlayer);
      setFinish(true);
      setAddScoreStr("");
      setState(s);
      saveGameRecord(nowPlayer, s);
      return;
    }

    s.turns = state.turns + 1;
    setAddScoreStr("");
    setState(s);

    setTimeout(() => scoreInputRef.current?.focus(), 50);
  };

  const saveGameRecord = async (winnerName: string, finalState: Molkky) => {
    try {
      const finalScores: { [name: string]: number } = {};
      finalState.playerOrder.forEach((p) => {
        finalScores[p] = getLastTotalFromState(finalState, p);
      });
      await addDoc(collection(db, MOLKKY_COLLECTION), {
        winner: winnerName,
        players: finalState.playerOrder,
        finalScores,
        createdAt: Timestamp.now(),
      });
    } catch {}
  };

  const getLastTotalFromState = (s: Molkky, player: string): number => {
    const turns = s.data[player];
    if (!turns || turns.length === 0) return 0;
    return turns[turns.length - 1].total;
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const q = query(
        collection(db, MOLKKY_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      const snap = await getDocs(q);
      const records: GameRecord[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<GameRecord, "id">),
      }));
      setHistory(records);
    } catch {}
    setHistoryLoading(false);
  };

  const movePlayer = (index: number, dir: -1 | 1) => {
    const newOrder = [...names];
    const target = index + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setNames(newOrder);
  };

  const addName = () => {
    const trimmed = name.trim();
    if (!trimmed || names.includes(trimmed)) return;
    setNames([...names, trimmed]);
    setName("");
  };

  const resetGame = (keepPlayers: boolean) => {
    if (keepPlayers) {
      const a: Molkky = { turns: 0, data: {}, playerOrder: players };
      players.forEach((n) => {
        a.data[n] = [];
      });
      setState(a);
    } else {
      setState({ turns: 0, data: {}, playerOrder: [] });
      setNames([]);
    }
    setFinish(false);
    setWinner("");
  };

  const startGame = () => {
    if (names.length === 0) return;
    const a: Molkky = { turns: 0, data: {}, playerOrder: [...names], practiceMode };
    names.forEach((n) => {
      a.data[n] = [];
    });
    setState(a);
  };

  const isSetup = num === 0;

  return (
    <div className="p-molkky">
      {isSetup ? (
        <>
          <div className="p-molkky__tabs">
            <button
              className={`p-molkky__tab ${tab === "game" ? "is-active" : ""}`}
              onClick={() => setTab("game")}
            >
              ゲーム
            </button>
            <button
              className={`p-molkky__tab ${tab === "history" ? "is-active" : ""}`}
              onClick={() => {
                setTab("history");
                loadHistory();
              }}
            >
              過去の結果
            </button>
          </div>

          {tab === "game" ? (
            <>
              <div className="p-molkky__title">ユーザーを追加</div>
              <div className="p-molkky__input-name-label">ユーザー名</div>
              <input
                className="p-molkky__input-name"
                placeholder="user name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addName();
                }}
              />
              <Button addClass="p-molkky__add" label="追加" onClick={addName} />
              <div className="p-molkky__input-users-label">ユーザー一覧（順番）</div>
              <ul className="p-molkky__users">
                {names.map((n, index) => (
                  <li className="p-molkky__user-column" key={index}>
                    <span className="p-molkky__user-name">{n}</span>
                    <div className="p-molkky__user-actions">
                      <button
                        className="p-molkky__order-btn"
                        onClick={() => movePlayer(index, -1)}
                        disabled={index === 0}
                      >
                        ▲
                      </button>
                      <button
                        className="p-molkky__order-btn"
                        onClick={() => movePlayer(index, 1)}
                        disabled={index === names.length - 1}
                      >
                        ▼
                      </button>
                      <button
                        className="p-molkky__delete-btn"
                        onClick={() => setNames(names.filter((_, i) => i !== index))}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <label className="p-molkky__practice-label">
                <input
                  type="checkbox"
                  className="p-molkky__practice-check"
                  checked={practiceMode}
                  onChange={(e) => setPracticeMode(e.target.checked)}
                />
                練習モード（0連続でも脱落なし）
              </label>
              <Button
                label="開始"
                addClass="p-molkky__start"
                onClick={() => {
                  if (names.length > 0 && confirm("開始しますか？")) startGame();
                }}
              />
            </>
          ) : (
            <div className="p-molkky__history">
              <div className="p-molkky__title">過去の結果</div>
              {historyLoading ? (
                <div className="p-molkky__history-loading">読み込み中...</div>
              ) : history.length === 0 ? (
                <div className="p-molkky__history-empty">記録がありません</div>
              ) : (
                <ul className="p-molkky__history-list">
                  {history.map((record, i) => (
                    <li key={record.id || i} className="p-molkky__history-item">
                      <div className="p-molkky__history-winner">
                        🏆 {record.winner}
                      </div>
                      <div className="p-molkky__history-date">
                        {record.createdAt
                          ? new Date(
                              record.createdAt.seconds * 1000
                            ).toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>
                      <div className="p-molkky__history-scores">
                        {record.players?.map((p) => (
                          <span key={p} className="p-molkky__history-score">
                            {p}: {record.finalScores?.[p] ?? "-"}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="p-molkky__playing">
          {!finish ? (
            <div className="p-molkky__menu">
              <div className="p-molkky__menu-top">
                <div className="p-molkky__now-player">
                  {nowPlayer}の番です
                  {state.practiceMode && (
                    <span className="p-molkky__practice-badge">練習</span>
                  )}
                </div>
                <Button
                  label="終了"
                  addClass="p-molkky__score-end"
                  onClick={() => {
                    if (confirm("ゲームを終了しますか？")) resetGame(false);
                  }}
                />
              </div>
              <div className="p-molkky__menu-bottom">
                <input
                  ref={scoreInputRef}
                  className="p-molkky__score-input"
                  type="number"
                  min={0}
                  max={12}
                  placeholder="スコアを入力"
                  value={addScoreStr}
                  onChange={(e) => setAddScoreStr(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") registerScore();
                  }}
                  autoFocus
                />
                <Button
                  label="登録"
                  addClass="p-molkky__score-add"
                  onClick={registerScore}
                />
              </div>
            </div>
          ) : (
            <div className="p-molkky__menu">
              <div className="p-molkky__menu-top">
                <div className="p-molkky__win-player">{winner}の勝ちです🎉</div>
                <Button
                  label="終了"
                  addClass="p-molkky__score-end"
                  onClick={() => resetGame(false)}
                />
              </div>
              <div className="p-molkky__menu-bottom">
                <Button
                  label="続ける"
                  addClass="p-molkky__score-continue"
                  onClick={() => setFinish(false)}
                />
                <Button
                  label="もう一度"
                  addClass="p-molkky__score-add u-wt u-bg-bl"
                  onClick={() => resetGame(true)}
                />
              </div>
            </div>
          )}

          <div className="p-molkky__table-wrap">
            <table className="p-molkky__table">
              <thead>
                <tr>
                  <th className="p-molkky__th-name">名前</th>
                  {Array.from({
                    length: Math.max(
                      ...players.map((p) => (state.data[p]?.length ?? 0))
                    ),
                  }).map((_, i) => (
                    <th key={i} className="p-molkky__th-turn">
                      {i + 1}
                    </th>
                  ))}
                  <th className="p-molkky__th-total">計</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => {
                  const turns = state.data[p] ?? [];
                  const consecutiveZeros = getConsecutiveZeros(p);
                  const isEliminated = consecutiveZeros >= 2;
                  const hasOneZero = consecutiveZeros === 1;
                  return (
                    <tr
                      key={p}
                      className={`p-molkky__tr ${p === nowPlayer && !finish ? "is-current" : ""} ${isEliminated ? "is-eliminated" : ""}`}
                    >
                      <td className="p-molkky__td-name">{p}</td>
                      {turns.map((t, i) => {
                        const isZero = t.score === 0;
                        const isLast = i === turns.length - 1;
                        const prevZero = i > 0 && turns[i - 1].score === 0;
                        const cellClass = isZero
                          ? prevZero
                            ? "is-miss-2"
                            : "is-miss-1"
                          : 50 - t.total <= 12
                          ? "u-re"
                          : "";
                        return (
                          <td
                            key={i}
                            className={`p-molkky__td-turn ${cellClass}`}
                          >
                            <div className="p-molkky__cell-score">{t.score}</div>
                            <div className="p-molkky__cell-total">{t.total}</div>
                          </td>
                        );
                      })}
                      <td className="p-molkky__td-total">
                        {turns.length > 0 ? turns[turns.length - 1].total : 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
