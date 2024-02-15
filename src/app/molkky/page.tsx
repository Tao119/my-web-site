"use client";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "src/components/button";

const APP_KEY = "molkky";

type Molkky = {
  turns: number;
  data: {
    [name: string]: number[];
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
  }, [state]);
  return (
    <>
      <div className="p-molkky">
        {num == 0 ? (
          <>
            <div className="p-molkky__title">ユーザーを追加</div>
            <div className="p-molkky__input-name-label">ユーザー名</div>
            <input
              className="p-molkky__input-name"
              placeholder="user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              addClass="p-molkky__add"
              label="追加"
              onClick={() => {
                setNames(names.add(name));
                setName("");
              }}
            />
            <div className="p-molkky__input-users-label">ユーザー一覧</div>
            <ul className="p-molkky__users">
              {Array.from(names).map((n, index) => (
                <li
                  className="p-molkky__user-column"
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
              addClass="p-molkky__start"
              onClick={() => {
                if (confirm("開始しますか？")) {
                  const a: Molkky = { turns: 0, data: {} };
                  names.forEach((n) => {
                    a.data[n] = [0];
                  });
                  setState(a);
                }
              }}
            />
          </>
        ) : (
          <>
            <div className="p-molkky__playing">
              {!finish ? (
                <div className="p-molkky__menu">
                  <div className="p-molkky__now-player">
                    {nowPlayer}の番です
                  </div>
                  <input
                    className="p-molkky__score-input"
                    type="number"
                    placeholder="スコアを入力"
                    value={addScore || ""}
                    onChange={(e) => setAddScore(parseInt(e.target.value))}
                  />
                  <Button
                    label="登録"
                    addClass="p-molkky__score-add"
                    onClick={() => {
                      if (!addScore) return;
                      const s = { ...state };
                      const sc = s.data[nowPlayer].slice(-1)[0] + addScore;
                      s.data[nowPlayer].push(sc > 50 ? 25 : sc);

                      sc == 50 ? setFinish(true) : s.turns++;

                      setAddScore(null);
                      setState(s);
                    }}
                  />
                </div>
              ) : (
                <div className="p-molkky__menu">
                  <div className="p-molkky__win-player">{nowPlayer}の勝ちです</div>
                  <Button
                    label="もう一度"
                    addClass="p-molkky__score-add u-wt u-bg-bl"
                    onClick={() => {
                      const a: Molkky = { turns: 0, data: {} };
                      players.forEach((n) => {
                        a.data[n] = [0];
                      });
                      setState(a);
                      setFinish(false);
                    }}
                  />
                  <Button
                    label="トップへ戻る"
                    addClass="p-molkky__score-add"
                    onClick={() => {
                      setState({ turns: 0, data: {} });
                      setFinish(false);
                    }}
                  />
                </div>
              )}
              <ul className="p-molkky__table">
                {players.map((n, index) => (
                  <li className="p-molkky__row" key={index}>
                    <div className="p-molkky__name">{n}</div>
                    <ol className={"p-molkky__scores"}>
                      {state.data[n].map((num, index) => (
                        <li
                          key={index}
                          className={`p-molkky__score-cell ${
                            50 - num <= 12 ? "u-re" : ""
                          }`}
                        >
                          {num}
                        </li>
                      ))}
                    </ol>
                    <div
                      key={state.data[n].length}
                      className={"p-molkky__last-cell"}
                    >
                      {state.data[n].slice(-1)[0]}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Page;
