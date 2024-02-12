"use client";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "src/components/button";

const APP_KEY = "molkky";

type Molkky = {
  turns: number;
  data: {
    [name: string]: number;
  };
};

const Page = () => {
  const [appState, setAppState] = useState<string | null>("");

  const [state, setState] = useState<Molkky>({ turns: 0, data: {} });
  const [name, setName] = useState("");
  const [names, setNames] = useState<Set<string>>(new Set());

  const [addScore, setAddScore] = useState<number | null>(null);
  const [finish, setFinish] = useState(false);

  const players = Object.keys(state.data);

  const num = players.length;
  const nowPlayer = players[state.turns % num];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppState(localStorage.getItem(APP_KEY));
    }
  }, []);

  useEffect(() => {
    appState ? setState(JSON.parse(appState)) : null;
  }, [appState]);

  useEffect(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(state));
    console.log(localStorage);
  }, [state]);
  return (
    <>
      {num == 0 ? (
        <>
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: "20px" }}>ユーザーを追加</div>
            <input
              style={{ fontSize: "20px", margin: "20px" }}
              placeholder="ユーザー名を入力"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              addClass="u-bg-bl u-wt"
              label="追加"
              onClick={() => {
                setNames(names.add(name));
                setName("");
              }}
            />
            <ul>
              {Array.from(names).map((n, index) => (
                <li
                  style={{ fontSize: "20px", margin: "20px" }}
                  key={index}
                  onClick={() => {
                    if (confirm("削除しますか？")) {
                      const a = new Set(names);
                      a.delete(n);
                      setNames(a);
                    }
                  }}
                >
                  {n}
                </li>
              ))}
            </ul>
            <Button
              label="開始"
              addClass="u-bg-bl u-wt"
              onClick={() => {
                const a: Molkky = { turns: 0, data: {} };
                names.forEach((n) => {
                  a.data[n] = 0;
                });
                setState(a);
              }}
            />
          </div>
        </>
      ) : !finish ? (
        <>
          <ul style={{ display: "flex", flexDirection: "row" }}>
            {players.map((n, index) => (
              <li
                style={{ display: "flex", flexDirection: "column" }}
                key={index}
              >
                <div style={{ fontSize: "20px", margin: "20px", flex: 1 }}>
                  {n}
                </div>
                <div
                  className={50 - state.data[n] <= 12 ? "u-re" : ""}
                  style={{ fontSize: "20px", margin: "20px", flex: 1 }}
                >
                  {state.data[n]}
                </div>
              </li>
            ))}
          </ul>

          <div style={{ fontSize: "20px", margin: "0 100px" }}>
            {nowPlayer}の番です
          </div>
          <input
            style={{ fontSize: "20px" }}
            type="number"
            placeholder="スコアを入力"
            value={addScore || ""}
            onChange={(e) => setAddScore(parseInt(e.target.value))}
          />
          <Button
            label="登録"
            onClick={() => {
              if (!addScore) return;
              const s = { ...state };
              const sc = s.data[nowPlayer] + addScore;
              s.data[nowPlayer] = sc > 50 ? 25 : sc;

              sc == 50 ? setFinish(true) : s.turns++;

              setAddScore(null);
              setState(s);
            }}
          />
        </>
      ) : (
        <>
          <div style={{ fontSize: "20px" }}>{nowPlayer}の勝ちです</div>
          <Button
            label="もう一度"
            addClass="u-bg-bl u-wt u-ml36"
            onClick={() => {
              const a: Molkky = { turns: 0, data: {} };
              players.forEach((n) => {
                a.data[n] = 0;
              });
              setState(a);
              setFinish(false);
            }}
          />
          <Button
            label="トップへ戻る"
            addClass="u-bg-bl u-wt u-ml36"
            onClick={() => {
              setState({ turns: 0, data: {} });
              setFinish(false);
            }}
          />
        </>
      )}
    </>
  );
};

export default Page;
