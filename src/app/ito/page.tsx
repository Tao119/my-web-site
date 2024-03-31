"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getDatabase, onChildAdded, push, ref } from "@firebase/database";
import { FirebaseError } from "@firebase/util";
import { getFirebaseApp } from "src/lib/firebase";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "src/components/button";
import { get, set, off, onValue, update, remove } from "firebase/database";

getFirebaseApp();

type ITO = {
  urName?: string;
  roomId?: string;
  urNum?: number;
  isOwner?: boolean;
  userGameStep?: UserGameStep;
};

type GameData = {
  owner: string;
  players: {
    [name: string]: { step: number; num: number; word: string; prenum: number };
  };
  chat: { name: string; message: string }[];
  step: number;
};

enum GameStep {
  waiting = 0,
  openNumber = 1,
  choiceWord = 2,
  predictOrder = 3,
  showAnswer = 4,
}

enum UserGameStep {
  waiting = 0,
  openedNumber = 1,
  choicedWord = 2,
}

const Page = () => {
  const [appState, setAppState] = useState<string | null>("");
  const APP_KEY = "ito";

  const [state, setState] = useState<ITO>({});

  const [inputName, setInputName] = useState("");
  const [inputRoomId, setInputRoomId] = useState("");
  const [inputWord, setInputWord] = useState("");
  const [showNumber, setShowNumber] = useState(false);

  const [gameData, setGameData] = useState<GameData>({
    owner: "",
    players: {},
    chat: [],
    step: 0,
  });

  const initializeGame = () => {
    setState({});
    setInputName("");
    setInputRoomId("");
    setInputWord("");
    setShowNumber(false);
  };

  const [tapped, setTapped] = useState<{ [index: number]: boolean }>({});

  const players = gameData.players
    ? Object.keys(gameData.players).map((key) => {
        return {
          ...gameData.players[key],
          name: key,
          id: key,
        };
      })
    : [];

  const openNumberAll = !players.some((p) => {
    return p.step !== UserGameStep.openedNumber;
  });

  const sendWordAll = !players.some((p) => {
    return p.step !== UserGameStep.choicedWord;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppState(localStorage.getItem(APP_KEY));
    }
  }, []);

  useEffect(() => {
    if (appState) {
      const s = JSON.parse(appState);
      setState(s);

      const checkRoomId = async () => {
        const db = getDatabase();
        let roomId = s.roomId;
        let roomRef = ref(db, `rooms/${roomId}`);

        const snapshot = await get(roomRef);
        console.log(snapshot.exists());
        if (!snapshot.exists()) {
          initializeGame();
        }
      };
      if (s.roomId) checkRoomId();
    }
  }, [appState]);

  useEffect(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const db = getDatabase();
    const roomRef = ref(db, `rooms/${state.roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setGameData(data);
    });

    return () => unsubscribe();
  }, [state.roomId]);

  const joinName = async () => {
    if (inputName !== "" && confirm(`${inputName} で登録しますか？`)) {
      const db = getDatabase();
      const roomRef = ref(db, `rooms/${state.roomId}`);
      const snapshot = await get(roomRef);
      let num = Math.floor(Math.random() * 100) + 1;

      if (state.isOwner) {
        const owner = inputName;
        const step = GameStep.waiting;

        await set(roomRef, {
          owner,
          step,
        });
      } else {
        if (snapshot.child(inputName).exists()) {
          return alert("このネームのユーザーがすでに入室しています");
        }

        const existingNums = new Set();
        snapshot.forEach((childSnapshot) => {
          childSnapshot.forEach((grandChildSnapshot) => {
            if (grandChildSnapshot.key === "num") {
              existingNums.add(grandChildSnapshot.val());
            }
          });
        });

        do {
          num = Math.floor(Math.random() * 100) + 1;
        } while (existingNums.has(num));
      }

      const newUserRef = ref(db, `rooms/${state.roomId}/players/${inputName}`);
      const step = UserGameStep.waiting;
      await set(newUserRef, { num, step });

      setState((prevState) => ({
        ...prevState,
        urName: inputName,
        urNum: num,
        userGameStep: UserGameStep.waiting,
      }));

      alert(`${state.isOwner ? "作成" : "登録"}が完了しました`);
    }
  };

  const updateGameStep = async (step: GameStep) => {
    const db = getDatabase();
    const roomRef = ref(db, `rooms/${state.roomId}`);
    await update(roomRef, { step });
  };

  const updatePrenum = async (num: number, ref_: string) => {
    const db = getDatabase();
    const prenum = num;
    const roomRef = ref(db, ref_);
    await update(roomRef, { prenum });
  };

  const generateRandomRoomId = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const createRoom = async () => {
    if (!confirm("作成しますか？")) return;
    const db = getDatabase();
    let roomId = generateRandomRoomId();
    let roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    while (snapshot.exists()) {
      roomId = generateRandomRoomId();
      roomRef = ref(db, `rooms/${roomId}`);
    }
    const time = format(new Date(), "HH:mm", {
      locale: ja,
    });

    setState({ ...state, ...{ roomId: roomId.toString(), isOwner: true } });
  };

  const joinRoom = async () => {
    const db = getDatabase();
    const roomRef = ref(db, `rooms/${inputRoomId}`);

    const snapshot = await get(roomRef);
    if (!snapshot.exists()) {
      return alert("ルームidが存在しません");
    }
    setState({ ...state, ...{ roomId: inputRoomId.toString() } });
  };

  const seeNumber = async () => {
    setShowNumber(true);
    const db = getDatabase();
    const playerRef = ref(db, `rooms/${state.roomId}/players/${state.urName}`);
    const step = UserGameStep.openedNumber;
    await update(playerRef, { step });
    setState((prevState) => ({
      ...prevState,
      userGameStep: step,
    }));
  };

  const sendWord = async () => {
    if (!confirm("送信しますか？")) return;
    const db = getDatabase();
    const playerRef = ref(db, `rooms/${state.roomId}/players/${state.urName}`);
    const word = inputWord;
    const step = UserGameStep.choicedWord;
    await update(playerRef, { word, step });
    setState((prevState) => ({
      ...prevState,
      userGameStep: step,
    }));
  };

  const logOut = async () => {
    if (!confirm("退出しますか？")) return;
    const db = getDatabase();
    const playerRef = ref(db, `rooms/${state.roomId}/players/${state.urName}`);
    const roomRef = ref(db, `rooms/${state.roomId}`);

    if (players.length == 1) {
      await remove(roomRef);
    } else {
      await remove(playerRef);
    }
    initializeGame();
  };

  const quitGame = async () => {
    const db = getDatabase();
    const roomRef = ref(db, `rooms/${state.roomId}`);
    await remove(roomRef);
    initializeGame();
  };

  const gameView = () => {
    switch (gameData.step) {
      case GameStep.waiting:
        return (
          <>
            <ul className="p-ito__userlist-2 u-mb36">
              {players.map((p, i) => (
                <li className="p-ito__users" key={i}>
                  {p.name}
                </li>
              ))}
            </ul>
            {state.isOwner ? (
              <Button
                addClass="p-ito__button u-bk u-bg-gr"
                label="開始する"
                onClick={() => {
                  if (!confirm("開始しますか？")) return;
                  updateGameStep(GameStep.openNumber);
                }}
              />
            ) : null}
          </>
        );
      case GameStep.openNumber:
        return (
          <>
            {showNumber ? (
              <div className="p-ito__num">{state.urNum}</div>
            ) : (
              <Button
                addClass="p-ito__shownum u-wt u-bg-dg"
                label="数字を見る"
                onClick={seeNumber}
              />
            )}
            {state.isOwner && openNumberAll ? (
              <Button
                addClass="p-ito__button u-bk u-bg-gr"
                label="次へ"
                onClick={() => updateGameStep(GameStep.choiceWord)}
              />
            ) : null}
          </>
        );
      case GameStep.choiceWord:
        return (
          <>
            {state.userGameStep == UserGameStep.choicedWord ? (
              <div className="p-ito__sent u-mb36">送信しました</div>
            ) : (
              <div className="p-ito__out">
                <input
                  className="p-ito__button u-mb36"
                  placeholder="ワードを入力"
                  type="text"
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value)}
                />
                <Button
                  onClick={sendWord}
                  addClass="p-ito__button u-wt u-bg-bl"
                  label="決定する"
                />
              </div>
            )}
            {state.isOwner && sendWordAll ? (
              <Button
                addClass="p-ito__button u-bk u-bg-gr"
                label="次へ"
                onClick={() => {
                  updateGameStep(GameStep.predictOrder);
                }}
              />
            ) : null}
          </>
        );
      case GameStep.predictOrder:
        return (
          <div className="p-ito__out">
            <ul className="p-ito__userlist-2 u-mb36">
              {players.map((p, i) => (
                <li className="p-ito__users" key={i}>
                  {`${p.name}: ${p.word}`}
                  {/* {state.isOwner ? (
                    <input
                      type="number"
                      value={p.prenum ?? 0}
                      onChange={(e) => {
                        updatePrenum(
                          parseInt(e.target.value),
                          `rooms/${state.roomId}/${p.name}`
                        );
                      }}
                    />
                  ) : null} */}
                </li>
              ))}
            </ul>
            {state.isOwner ? (
              <Button
                addClass="p-ito__button u-bk u-bg-gr"
                label="答えを見る"
                onClick={() => {
                  if (!confirm("答えをみますか？")) return;
                  updateGameStep(GameStep.showAnswer);
                }}
              />
            ) : null}
          </div>
        );
      case GameStep.showAnswer:
        return (
          <div className="p-ito__out">
            <div className="p-ito__in">
              <ul className="p-ito__userlist u-mb36">
                {players
                  .sort((a, b) => b.prenum ?? 0 - a.prenum ?? 0)
                  .map((p, i) => (
                    <li className="p-ito__users" key={i}>
                      {`${p.name}: ${p.word}`}
                    </li>
                  ))}
              </ul>
              <ul className="p-ito__userlist u-mb36">
                {players
                  .sort((a, b) => b.num - a.num)
                  .map((p, i) => (
                    <li
                      className="p-ito__users"
                      key={i}
                      onClick={() => {
                        console.log(tapped[i]);
                        setTapped((prev) => ({
                          ...prev,
                          [i]: !tapped[i] ?? true,
                        }));
                      }}
                    >
                      {tapped[i]
                        ? `${p.name}: ${p.num}(${p.word})`
                        : `${i + 1}`}
                    </li>
                  ))}
              </ul>
            </div>
            <Button
              addClass="p-ito__button u-wt u-bg-bl"
              label="終了する"
              onClick={quitGame}
            />
          </div>
        );
      default:
        return <>更新中です。</>;
    }
  };

  return (
    <>
      <div className="p-ito__title">ITO</div>
      <div className="p-ito__urname">{`name: ${state.urName ?? ""}`}</div>
      <div className="p-ito__roomid">{`id: ${state.roomId ?? ""}`}</div>
      <div className="p-ito__urnum">{`number: ${
        state.userGameStep ? state.urNum ?? "" : ""
      }`}</div>
      {!state.roomId ? (
        <div className="p-ito__out">
          <Button
            addClass="p-ito__button u-mb36 u-bk u-bg-gr"
            label="ルーム作成"
            onClick={createRoom}
          />
          <input
            placeholder="idを入力してください"
            className="p-ito__button u-mb36"
            type="text"
            value={inputRoomId}
            onChange={(e) => setInputRoomId(e.target.value)}
          />
          <Button
            addClass="p-ito__button  u-wt u-bg-bl"
            label="ルーム参加"
            onClick={() => joinRoom()}
          />
        </div>
      ) : !state.urName ? (
        <div className="p-ito__out">
          <input
            className="p-ito__button u-mb36"
            placeholder="名前を入力してください"
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          ></input>
          <Button
            addClass="p-ito__button u-bg-gr u-bk"
            label="決定"
            onClick={() => joinName()}
          />
        </div>
      ) : (
        <div className="p-ito__out">
          {gameView()}
          <Button
            addClass="p-ito__logout u-wt u-bg-re"
            label="退出する"
            onClick={logOut}
          />
        </div>
      )}
    </>
  );
};
export default Page;
