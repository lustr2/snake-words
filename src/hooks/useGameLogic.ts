import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import equal from "fast-deep-equal";
import { LetterObject } from '../components/data/Data';
import { SlovaZDB, Word } from '../models/AppModels';
import { UserSettings } from '../components/context/SettingsContext';
import CheckLetterGame from '../utils/CheckGame';
import { updateGameOnDb, updateHistory } from '../utils/UpdateGame';

export const useGameLogic = (login: UserSettings) => {
  const { t } = useTranslation();

  /** Upload from DB */
  const [slovaZDB, setSlovaZDB] = useState<SlovaZDB>({ idSlov: [], slova: [], userPlayed: [] });
  const [pointerSlova, setPointerSlova] = useState<number>(-1);
  const [changeLength, setChangeLength] = useState<boolean>(false);

  /** Game ... */
  const [letterCount, setLetterCount] = useState<number>(login.actLengthWords || 0);
  const [sign, setSign] = useState<Word>({ word: Array(letterCount).fill(''), states: 'free', activeFocus: 0 });
  const [numberActiveInput, setNumberActiveInput] = useState<number>(0);
  const [activeWord, setActiveWord] = useState<string>('');

  const [wrongLetter, setWrongLetter] = useState<string[]>([]);
  const [rightLetter, setRightLetter] = useState<string[]>([]);
  const [misplaceLetter, setMisplaceLetter] = useState<string[]>([]);
  const [history, setHistory] = useState<LetterObject[]>([]);
  const [finish, setFinish] = useState<boolean>(true);

  const [continuePlay, setContinuePlay] = useState<boolean>(false);
  const [continueAW, setContinueAW] = useState<number>(-1);
  const [continueShots, setContinueShots] = useState<string[]>([]);
  
  const [errorText, setErrorText] = useState<string>('');

  // Update sign when letterCount changes
  useEffect(() => {
    setSign({ word: Array(letterCount).fill(''), states: 'free', activeFocus: 0 });
  }, [letterCount]);

  const updateWord = (index: number, newValue: string) => {
    setSign(prevSign => ({
      ...prevSign,
      word: prevSign.word.map((value, i) => (i === index ? newValue : value))
    }));
  };

  const handleChangeSign = (s: string) => {
    updateWord(numberActiveInput, s);
    onChangeInput(numberActiveInput + 1);
  };

  const onChangeInput = (n: number) => {
    if (n < letterCount) {
      setNumberActiveInput(n);
      setSign(prevSign => ({ ...prevSign, activeFocus: n }));
    }
  };

  const onChangeInputAuto = (s: string, n: number) => {
    if (s === '') {
      updateWord(n, s);
    } else {
      updateWord((n - 1 > 0) ? n - 1 : 0, s);
    }
    onChangeInput(n);
  };

  const settingAutoFill = (aW?: string, aShots?: string[]) => {
    if (login.autoFill) {
      const s: string[] = (aW) ? aW.split("") : activeWord.split("");
      const tmpSign: string[] = Array(s.length).fill('');

      if (history.length > 0) {
        const findWordHistoryIndex = history.findIndex(h => h.model === s.join(""));
        const historyWord = [...history[(findWordHistoryIndex < 0) ? history.length - 1 : findWordHistoryIndex].history, sign.word.join('')];
        s.forEach((sA, i) => {
          if (findWordHistoryIndex >= 0) {
            historyWord.forEach(h => {
              if (h[i] === sA) {
                tmpSign[i] = sA;
              }
            });
          } else {
            (aShots) &&
              aShots.forEach(h => {
                if (h[i] === sA) {
                  tmpSign[i] = sA;
                }
              });
          }
        });
      } else {
        (aShots) &&
          s.forEach((sA, i) => {
            aShots.forEach(h => {
              if (h[i] === sA) {
                tmpSign[i] = sA;
              }
            });
          });
      }
      setSign(oldSign => ({ ...oldSign, word: [...tmpSign] }));
    }
  };

  const onSubmitWord = (fin: boolean, shots: string[]) => {
    const tmpSignWord: string[] = [...sign.word];
    const [newRightLetter, newMisplaceLetter, newWrongLetter]: string[][] = CheckLetterGame({
      activeWord: activeWord,
      newWord: tmpSignWord,
      rightLetter: rightLetter,
      misplaceLetter: misplaceLetter,
      wrongLetter: wrongLetter
    });
    setRightLetter(newRightLetter);
    setMisplaceLetter(newMisplaceLetter);
    setWrongLetter(newWrongLetter);

    updateHistory({
      newHistory: shots,
      fin,
      activeWord,
      sign,
      history,
      setHistory,
      pointerSlova,
      login,
      slovaZDB,
      setSlovaZDB,
      setErrorText
    });

    if (fin) {
      setFinish(true);
    } else {
      setSign({ word: Array(letterCount).fill(''), states: 'free', activeFocus: 0 });
      setNumberActiveInput(0);
      settingAutoFill();
    }
  };

  useEffect(() => {
    const fetchWordsOnHistoryDb = async () => {
      if ((login.id !== 0) && (changeLength)) {
        try {
          const response = await fetch(`/api/dataU/${login.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 200) {
            const wordsRes = await response.json();
            setSlovaZDB(oldZDB => {
              if (!oldZDB) return oldZDB;
              return {
                ...oldZDB,
                userPlayed: oldZDB.userPlayed?.map((played, i) => {
                  const foundWord = wordsRes.find((w: { idWord: number; }) => w.idWord === oldZDB.idSlov[i]);
                  return foundWord ? foundWord.done : played;
                })
              };
            });
          } else {
            const wordsResError = await response.text();
            setErrorText(wordsResError);
          }
          setChangeLength(false);
        } catch (ex) {
          console.log("Chyba pri cteni words a history z DB" + ex);
        }
      }
    };

    fetchWordsOnHistoryDb();
  }, [login, changeLength]);

  useEffect(() => {
    const fetchWordsOnDb = async (delka: number) => {
      if (delka > 0) {
        try {
          const response = await fetch(`/api/words/playing/${delka}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 200) {
            const wordsRes = await response.json();
            setSlovaZDB({
              slova: [...wordsRes.map((w: { word: string; }) => w.word.toUpperCase())],
              idSlov: [...wordsRes.map((w: { idWord: number; }) => w.idWord)],
              userPlayed: [...Array(wordsRes.length).fill(false)]
            });
            setChangeLength(true);
          } else {
            const wordsResError = await response.text();
            setErrorText(wordsResError);
          }
        } catch (ex) {
          console.log("Chyba pri cteni words z DB" + ex);
        }
      }
    };

    fetchWordsOnDb(letterCount);
  }, [letterCount]);

  const resetGameState = (activeWord: string) => {
    setActiveWord(activeWord);
    setWrongLetter([]);
    setMisplaceLetter([]);
    setRightLetter([]);
    setNumberActiveInput(0);
    setErrorText('');
  };

  const choiceModel = async () => {
    if (finish && login.id > 0) {
      setContinuePlay(false);
      setSign({ word: Array(letterCount).fill(''), states: 'free', activeFocus: 0 });
      resetGameState('');
      setContinueAW(-1);
      setContinueShots([]);

      let countCycle: number = 100;
      while (countCycle > 0) {
        const tmpPointer = Math.round(Math.random() * (slovaZDB.slova.length - 1));
        if ((tmpPointer > -1) && (!slovaZDB.userPlayed[tmpPointer])) {
          setPointerSlova(tmpPointer);
          setActiveWord(slovaZDB.slova[tmpPointer]);
          setFinish(false);
          setErrorText('');
          setHistory(oldHis => [...oldHis,
          {
            model: slovaZDB.slova[tmpPointer],
            gameIndex: slovaZDB.idSlov[tmpPointer],
            finished: false,
            history: []
          }]);
          break;
        }
        countCycle--;
      }
      if (countCycle === 0) {
        setErrorText(t('errors.noMoreWords'));
      }
    } else {
      const tmpActiveWord: string = activeWord;
      setActiveWord('');
      const countFilling = sign.word.join("").length;
      const cancelGame: string[] = [...(history.length > 0 ? history[history.length - 1].history : [])];
      if (countFilling === 0) {
        ((cancelGame.length > 0) && (equal(history[history.length - 1].model, tmpActiveWord))) &&
          updateGameOnDb({
            fin: finish,
            shots: cancelGame,
            login,
            pointerSlova,
            slovaZDB,
            setSlovaZDB,
            setErrorText
          });
      } else {
        setHistory(prevHistory => {
          const updatedHistory = [...prevHistory];
          if (updatedHistory.length > 0) {
            if (equal(history[history.length - 1].model, tmpActiveWord)) {
              const lastEntry = updatedHistory[updatedHistory.length - 1];
              if (!lastEntry.history.includes(sign.word.join(""))) {
                lastEntry.history = [...cancelGame];
              }
            }
          }
          return updatedHistory;
        });
        updateGameOnDb({
          fin: finish,
          shots: [...cancelGame],
          login,
          pointerSlova,
          slovaZDB,
          setSlovaZDB,
          setErrorText
        });
      }
      setFinish(true);
      setContinuePlay(false);
    }
  };

  const continueGame = (aW: number, shots: string[]) => {
    const tmpPointer = slovaZDB.idSlov.findIndex(id => (id === aW));
    setPointerSlova((tmpPointer !== undefined) ? tmpPointer : -1);
    if ((tmpPointer !== undefined) && (tmpPointer !== -1)) {
      const tmpActiveWord: string = slovaZDB.slova[tmpPointer];
      setActiveWord(tmpActiveWord);
      setSign({ word: Array(letterCount).fill(''), states: 'free', activeFocus: 0 });
      let tmpRightLetter: string[] = [];
      let tmpMisplaceLetter: string[] = [];
      let tmpWrongLetter: string[] = [];
      const tmpIndex: number = history.findIndex(h => (h.gameIndex === aW));
      if (tmpIndex === -1) {
        setHistory(oldHistory => [...oldHistory,
        {
          model: tmpActiveWord,
          gameIndex: aW,
          finished: false,
          history: (shots[shots.length - 1].length < tmpActiveWord.length)
            ? shots.slice(0, shots.length - 2)
            : shots
        }
        ]
        );
      }
      shots.forEach((s, index) => {
        if (index < shots.length) {
          const [newRightLetter, newMisplaceLetter, newWrongLetter]: string[][] =
            CheckLetterGame({
              activeWord: tmpActiveWord,
              newWord: s.split(''),
              rightLetter: tmpRightLetter,
              misplaceLetter: tmpMisplaceLetter,
              wrongLetter: tmpWrongLetter
            });
          tmpRightLetter = newRightLetter;
          tmpMisplaceLetter = newMisplaceLetter;
          tmpWrongLetter = newWrongLetter;
        }
      });
      setRightLetter(tmpRightLetter);
      setMisplaceLetter(tmpMisplaceLetter);
      setWrongLetter(tmpWrongLetter);

      settingAutoFill(tmpActiveWord, shots);
      setNumberActiveInput(0);
      setFinish(false);
      setErrorText('');
      setContinuePlay(true);
    }
  };

  useEffect(() => {
    if ((continueAW > -1) &&
      (slovaZDB) &&
      (slovaZDB?.slova.length > 0) &&
      (pointerSlova === -1)
    ) {
      const tmpPointer = slovaZDB.idSlov.findIndex(id => (id === continueAW));
      setPointerSlova((tmpPointer !== undefined && tmpPointer >= 0) ? tmpPointer : -1);

      if (tmpPointer !== -1) {
        continueGame(continueAW, continueShots);
      } else {
        setErrorText(t('errors.wordNotFound'));
      }
    }
  }, [slovaZDB]);

  const waitForSlovaZDB = async () => {
    while (!slovaZDB || (slovaZDB.slova.length === 0) && (slovaZDB.slova[0].length !== letterCount)) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const handleClickContinue = async (aW: number, length: number, shots: string[]) => {
    if (letterCount !== length) {
      setChangeLength(true);
      setLetterCount(length);
      setContinueAW(aW);
      setContinueShots(shots);

      await new Promise<void>((resolve) => {
        const checkLengthChange = () => {
          if (!changeLength) {
            resolve();
          } else {
            setTimeout(checkLengthChange, 100);
          }
        };
        checkLengthChange();
      });
    }

    await waitForSlovaZDB();
    continueGame(aW, shots);
  };

  return {
    slovaZDB,
    pointerSlova,
    changeLength,
    letterCount,
    sign,
    numberActiveInput,
    activeWord,
    wrongLetter,
    rightLetter,
    misplaceLetter,
    history,
    finish,
    continuePlay,
    errorText,
    setLetterCount,
    setChangeLength,
    setHistory,
    setFinish,
    setErrorText,
    setActiveWord,
    setRightLetter,
    setWrongLetter,
    setMisplaceLetter,
    setNumberActiveInput,
    setContinuePlay,
    setContinueAW,
    setContinueShots,
    setPointerSlova,
    setSlovaZDB,
    handleChangeSign,
    onChangeInput,
    onChangeInputAuto,
    onSubmitWord,
    choiceModel,
    handleClickContinue,
    resetGameState,
  };
};
