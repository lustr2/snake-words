import { useEffect, useState } from 'react';
import Deskboard from './components/deskboard/Deskboard';
import Keyboard from './components/keyboard/Keyboard';
import { LetterObject } from './components/data/Data';
import { SlovaZDB, Word } from './models/AppModels';
import { UserSettings, UserContext } from './components/context/SettingsContext';
import RegistrationPage from './components/loginpage/RegistrationPage';
import LoginPage from './components/loginpage/LoginPage';
import GameSettings from './components/gamesettings/GameSettings';
import CheckLetterGame  from './utils/CheckGame';
import { updateGameOnDb, updateHistory } from './utils/UpdateGame';

import equal from "fast-deep-equal";
import './App.css'
import GameHistory from './components/gamehistory/GameHistory';
import RulesGame from './components/rulesgame/RulesGame';
import StatisticsGame from './components/statisticsgame/StatisticsGame';


function App() {
  /** Menu */
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<boolean>(false);
  const [continuePlay, setContinuePlay] = useState<boolean>(false);
  const [rulesGame, setRulesGame] = useState<boolean>(false);
  const [statisticsGame, setStatisticsGame] = useState<boolean>(false);

  /** Upload from DB */
  const [slovaZDB, setSlovaZDB] = useState<SlovaZDB>({idSlov:[], slova: [], userPlayed: []});
  const [pointerSlova, setPointerSlova] = useState<number>(-1); 
  const [changeLength, setChangeLength] = useState<boolean>(false);

  /** Game ... */
  const [letterCount, setLetterCount] = useState<number>(0);
  const [sign, setSign] = useState<Word>({word: Array(letterCount).fill(''), states: 'free', activeFocus: 0});
  const [numberActiveInput, setNumberActiveInput] = useState<number>(0);
  const [activeWord, setActiveWord] = useState<string>('');

  const [wrongLetter, setWrongLetter] = useState <string[]>([]);
  const [rightLetter, setRightLetter] = useState <string[]>([]);
  const [misplaceLetter, setMisplaceLetter] = useState <string[]>([]);
  const [history, setHistory] = useState<LetterObject[]>([]);
  const [finish, setFinish] = useState<boolean>(true); 

  const [continueAW, setContinueAW] = useState<number>(-1);
  const [continueShots, setContinueShots] = useState<string[]>([]);


  /** Registration/Login section */
  const [loginNow, setLoginNow] = useState<boolean>(false);
  const [login, setLogin] = useState<UserSettings>({id: 0, userName: '', actLengthWords: 5, autoFill: false /*, autoCorrect: false*/ });
  const [registrationNew, setRegistrationNew] = useState<boolean>(false); 
  const [errorText, setErrorText] = useState<string>('');
  
  /** Ukladani do Local Stored */
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    setItems(sign.word);
  }, [sign]);
  
  const updateWord = (index: number, newValue: string) => {
    setSign(prevSign => ({
      ...prevSign,
      word: prevSign.word.map((value, i) => (i === index ? newValue : value))
    }));
  };

  const handleChangeSign = (s : string) =>  {
    // chci vyplnit tento znak do pole s focusem
//    console.log('App - Menime znak: ' + s  + ', na pozici: ' + numberActiveInput);
    updateWord(numberActiveInput, s);
    onChangeInput(numberActiveInput+1)
  }

  const onChangeInput = (n:number) => { // zmena index focusu!!!!! + nedelam updateWord!!!
//    console.log('App - Zmena inputu: ' + n)
    if (n < letterCount) { 
      setNumberActiveInput(n);
      setSign(prevSign => ({...prevSign, activeFocus: n}));
    }
  }

  const onChangeInputAuto = (s: string, n:number) => { // n uz mam zvetseny index focusu!!!!! 
//    console.log('App - Zapis na pozici n-1: ' + (n-1) + ' a vkladam: ' + s)
    if (s === '') {
      updateWord(n, s);
    } else {
      updateWord((n-1>0) ? n-1 : 0, s);
    }
    onChangeInput(n);
  }

  const settingAutoFill = (aW?: string, aShots?: string[]) => {
    if (login.autoFill) {

      const s: string[] = (aW) ? aW.split("") : activeWord.split("");
      const tmpSign: string[] = Array(s.length).fill(''); 

      if (history.length > 0) {
        const findWordHistoryIndex = history.findIndex(h => h.model === s.join(""));
        console.log('Nalezen index v history: ' + findWordHistoryIndex);
//        const historyWord = [...history[history.length - 1].history, sign.word.join('')];
        const historyWord = [...history[(findWordHistoryIndex < 0) ? history.length - 1 : findWordHistoryIndex].history, sign.word.join('')];
        console.log('HIstoryWord: ' + historyWord);
        s.forEach((sA, i) => {
          // kontrola, zda je na spravnem miste uhodnuto
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
        })
      } else { // jeste nebyla odehrana zadna hra a tak v history nic neni, ale hrac chce pokracovat v nedodelane hre
        (aShots) && 
          s.forEach((sA, i) => {
              aShots.forEach(h => {
                if (h[i] === sA) {
                  tmpSign[i] = sA;
                }
              });
          })
      }
      console.log('autofill: ' + tmpSign.length + ', a je to: ' + tmpSign);
      setSign(oldSign => ({...oldSign, word: [...tmpSign]}));
    }
  }

  /** Kontrola odeslanych znaku a nastaveni poli - nepouzivam, obsah prenesen do onSubmitWord
  */
  // const choiceSignLetter = (newWord: string[]) => {
  //   const [newRightLetter, newMisplaceLetter, newWrongLetter]: string[][] = CheckLetterGame({
  //     activeWord: activeWord,  
  //     newWord: newWord,    
  //     rightLetter: rightLetter,
  //     misplaceLetter: misplaceLetter,
  //     wrongLetter: wrongLetter
  //   });
  //   setRightLetter(newRightLetter);
  //   setMisplaceLetter(newMisplaceLetter);
  //   setWrongLetter(newWrongLetter);
  // }

  const onSubmitWord = (fin: boolean, shots: string[]) => {
    const tmpSignWord: string[] = [...sign.word];
    console.log(shots); 
//    choiceSignLetter(tmpSignWord); // nahrazeno nasledujicimi 4 radky
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

    updateHistory(shots, fin, activeWord, sign, history, setHistory,  pointerSlova, login, slovaZDB, setSlovaZDB, setErrorText, updateGameOnDb);
//   setHistory([...oldHis, {model : activeWord, finished: fin, gameIndex: oldHis.length, history: shots}]);

    if (fin) {
//      setSign({word: Array(letterCount).fill(''), activeFocus: 0});
      setFinish(true);
//      setActiveWord('');
    } else {
      setSign({word: Array(letterCount).fill(''), states: 'free', activeFocus: 0});
      setNumberActiveInput(0);
      settingAutoFill();
    }
  }

  /** Najde vsechna idWords, ktera dany uzivatel hral a vrati seznam {idWords, played} 
   * a aktualizuje seznam v prohlizeci, pokud je jiz zalogovan */
  useEffect(() => {
    const fetchWordsOnHistoryDb = async () => {
//  const wordsOnHistoryDb = async() => {
      if ((login.id !== 0) && (changeLength)) { 
//        console.log('Nastavuji true/false hrace');
        try {
          const response = await fetch(`/api/dataU/${login.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            }
          );
          if (response.status === 200) { // OK
            const wordsRes = await response.json();
            setSlovaZDB(oldZDB => {
              if (!oldZDB) return oldZDB; // Pokud je slovaZDB undefined, nic neaktualizuj
              return {
                ...oldZDB,
                userPlayed: oldZDB.userPlayed?.map((played, i) => {
                  const foundWord = wordsRes.find(w => w.idWord === oldZDB.idSlov[i]);
                  return foundWord ? foundWord.done : played;
                })
              };
            });
          } else {
            // 500 ... vratit do formulare a vypsat chybu ... 
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

  useEffect (() => {
    const fetchWordsOnDb = async(delka: number) => {
      if (delka > 0) {
        try {
          const response = await fetch(`/api/words/playing/${delka}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            }
          );
          if (response.status === 200) {
            const wordsRes = await response.json();
            //! vytvarime novy obsah poli (nedelame spread)
            setSlovaZDB({
              slova: [...wordsRes.map(w => w.word.toUpperCase())],
              idSlov: [...wordsRes.map(w => w.idWord)],
              userPlayed: [...Array(wordsRes.length).fill(false)]
            });
            setChangeLength(true);
    //        setSlovaZDB(wordsRes.map(w => w.word));
    //        setIdSlovaZDB(wordsRes.map(w => w.idWord));
            console.log("Nactena data:", wordsRes);
          } else {
            // vratit do formulare a vypsat chybu ... 
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
    setStatisticsGame(false);
  };

  const choiceModel = async() => {
    if (finish && login.id > 0) {
      setContinuePlay(false);
      setViewHistory(false);
      setSign({word: Array(letterCount).fill(''), states: 'free', activeFocus: 0});
      
      resetGameState('');
/*    setActiveWord('');
      setWrongLetter([]);
      setMisplaceLetter([]);
      setRightLetter([]);
      setNumberActiveInput(0); */

      setContinueAW(-1);
      setContinueShots([]);

      let countCycle: number = 100;
      while (countCycle > 0) {
        const tmpPointer = Math.round(Math.random() * slovaZDB.slova.length-1);
//        console.log('Pointer: ' + tmpPointer);
        if ((tmpPointer > -1 ) && (!slovaZDB.userPlayed[tmpPointer])) {
          setPointerSlova(tmpPointer);
          console.log('Nastavujeme: ' + slovaZDB.slova[tmpPointer]);
          setActiveWord(slovaZDB.slova[tmpPointer]);
          setFinish(false);
          setErrorText('');
          setHistory(oldHis => [...oldHis, 
                      { model: slovaZDB.slova[tmpPointer], 
                        gameIndex: slovaZDB.idSlov[tmpPointer],
                        finished: false,
                        history: []
                      }]);
          break;
        }
        countCycle--;
      }
      if (countCycle === 0 ) {
        setErrorText('Nejsou dalsi slova ...');
      }
    } else {
//     console.log('ELSE - to neni dokoncene, rozepsane slovo zahod');
//      updateHistory(sign.word, finish);   neni dobre!!!!
      // poslat do db - trochu problem, ze nevim, kde naposledy byla sloucena pismena ... kd
      const tmpActiveWord: string = activeWord;
      setActiveWord('');
      const countFilling = sign.word.join("").length;
      const cancelGame: string[] = [...(history.length > 0 ? history[history.length - 1].history : [])];
      if (countFilling === 0) {
        console.log('Nedokoncil pokus o uhodnuti ... kdyz je to 0, nezapisujeme do db, protoze slovo vubec nezacal : ' + cancelGame.length);
        console.log(' Porovnavam ' + (equal(history[history.length - 1].model, tmpActiveWord)));
        ((cancelGame.length > 0) && (equal(history[history.length - 1].model, tmpActiveWord))) &&
//          updateGameOnDb(finish, cancelGame);
          updateGameOnDb(finish, cancelGame, login, pointerSlova, slovaZDB, setSlovaZDB, setErrorText);
      } else {
//      pokud nedokoncil pokus o uhodnuti, nezapisujeme jej ani do db ani do history (pokud uz v history je, odstranime jej) 
//        const tmpSign: string = sign.word.map(s => (equal(s, '') ? '-' : s)).join('');
        setHistory(prevHistory => {
            const updatedHistory = [...prevHistory];
            if (updatedHistory.length > 0) {
//              console.log('updatedHistory je: ' + updatedHistory.length);
              if (equal(history[history.length - 1].model, tmpActiveWord)) { 
                const lastEntry = updatedHistory[updatedHistory.length - 1];
                if (!lastEntry.history.includes(sign.word.join(""))){
//                  lastEntry.history = [...cancelGame, sign.word.join("")];
//                    lastEntry.history = [...cancelGame, tmpSign];
                    lastEntry.history = [...cancelGame];
                }
              }
            }
            return updatedHistory;
        });
//        updateGameOnDb(finish, [...cancelGame, sign.word.join("")]);      
//        updateGameOnDb(finish, [...cancelGame, sign.word.join("")], login, pointerSlova, slovaZDB, setSlovaZDB, setErrorText);
//        updateGameOnDb(finish, [...cancelGame, tmpSign], login, pointerSlova, slovaZDB, setSlovaZDB, setErrorText);
        updateGameOnDb(finish, [...cancelGame], login, pointerSlova, slovaZDB, setSlovaZDB, setErrorText);
      }
//      const cancelGame = [...history.flatMap(h => h.history), sign.word.join("")];
//      updateGameOnDb(finish, cancelGame);
      // ??? asi  dalsi buton ... continue ???
      // ... asi budeme chtit, aby priste musel pokracovat, kdyz toto slovo nema hotove, to znamena nacist rozdelane slovo a zobrazit ...
      setFinish(true);
      setContinuePlay(false);
    }
  }

  const loginButton = () => {
    setRulesGame(false);
    if (login.userName === '') {
      setLoginNow(true);
    } else {
      setLoginNow(false);
    }
//    nactiTestovaciData();
  }

  const registrationButton = () => {
    setErrorText('');
    setViewHistory(false);
    setLoginNow(false);
    setRegistrationNew(old => !old);
  }

  const logoutButton = () => {
    const tmpLetterCount = 0;
    setLoginNow(false);
    setRegistrationNew(false);
    setLetterCount(tmpLetterCount);
    setLogin({id:0, userName: '', actLengthWords: tmpLetterCount, autoFill: false /*, autoCorrect: false */});
    setSign({word: Array(tmpLetterCount).fill(''), states: 'free', activeFocus: 0});

    resetGameState('');
 /* setActiveWord('');
    setWrongLetter([]);
    setMisplaceLetter([]);
    setRightLetter([]);
    setNumberActiveInput(0);
    setErrorText(''); */

    setShowSettings(false);
    setSlovaZDB({idSlov:[], slova: [], userPlayed: []});
    setPointerSlova(-1);
    setContinuePlay(false);
    setHistory([]);
    setContinueAW(-1);
    setContinueShots([]);
  }

  const handleClickRegistration = ( rd: UserSettings, errText: string ) => {
    setErrorText(errText);
    setViewHistory(false);
    setLoginNow(false);
    setRegistrationNew(false);
//    registrationOnDb (rd);
    if (errText === '') {
      setLogin(rd);
      setLetterCount(rd.actLengthWords);
    }
  }

  const handleClickLogin = ( ld: UserSettings, errText: string ) => {
    setErrorText(errText);
    setViewHistory(false);
    setLoginNow(false);
//    loginOnDb (ld);
    if (errText === '') {
      setLogin(ld);
      setLetterCount(ld.actLengthWords);
    }
  }

  const handleSettingsClick = () => {
    setViewHistory(false);
    setRulesGame(false);
    setShowSettings(true); // Nastaví stav na true, což zobrazí komponentu GameSettings
    setActiveWord('');
    setErrorText('');
    setStatisticsGame(false);
  };

  const handleSubmitSettings = (us: UserSettings, changeLen: boolean, errText: string) => {
//    console.log('Ukladani novych settings ...');
//    console.log(s);
//    onSubmitSettings(s);
    setShowSettings(false);
    setViewHistory(false);
    setRulesGame(false);
    setLetterCount(us.actLengthWords);
    setChangeLength(changeLen);
    setLogin(us);
    setErrorText(errText);
    setStatisticsGame(false);
  }

//   const onSubmitSettings = async( ud: UserSettings ) => {
//     setShowSettings(false);
//     try {
//       const response = await fetch('/api/set_uzivatel', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id: ud.id,
//           lengthWords: ud.actLengthWords,
//           autoFill: ud.autoFill
//         }),
//       });

//       if (response.status === 200) {
// //        set( oldSet => {...oldSet, actLengthWords: settingsRes.actLengthWords, autoFill: settingsRes.autoFill} );
//       // proslo to ... nastavime, co jsme posilali do db
//         const kolik: number = ud.actLengthWords;
//         setLetterCount(kolik);
//         setChangeLength(true);
//         setLogin(ud);
// //        wordsOnDb(kolik);
//       } else {
//         // vratit do formulare a vypsat chybu ... 
//         const settingsRes = await response.text();
//         setErrorText(settingsRes);
//       }
//     } catch (ex) {
//       console.log("Chyba pri odesilani nastaveni .. " + ex);
//     }    

//   }

  const handleSettingsCancel = () => {
    setShowSettings(false);
    setViewHistory(false);
  }

  const handleHistoryClick = () => {
    setShowSettings(false);
    setRulesGame(false);
    setViewHistory(true);
    
    resetGameState('');
/*  setActiveWord('');
    setErrorText('');
    setRightLetter([]);
    setWrongLetter([]);
    setMisplaceLetter([]); */
    
    setContinueAW(-1);
    setContinueShots([]);
  }

  const continueGame = (aW: number, shots : string[]) => {
    // vyhledame pointer v slovaZDB
    const tmpPointer = slovaZDB.idSlov.findIndex(id => (id === aW));
    setPointerSlova((tmpPointer !== undefined)? tmpPointer : -1);
    console.log('TmpPointerje: ' + tmpPointer);
    if ((tmpPointer !== undefined) && (tmpPointer !== -1)) {
      const tmpActiveWord: string = slovaZDB.slova[tmpPointer];
      console.log('TmpActiveWord: ' + tmpActiveWord );
      setViewHistory(false);
      setActiveWord(tmpActiveWord);
      setSign({word: Array(letterCount).fill(''), states: 'free', activeFocus: 0});
      let tmpRightLetter: string[] = [];
      let tmpMisplaceLetter: string[] = [];
      let tmpWrongLetter: string[] = [];
      const tmpIndex: number = history.findIndex(h => (h.gameIndex === aW));
      console.log('Shots: ' + shots);
//        const tmpSymbol: boolean = shots.some(s => /-/.test(s));
      if (tmpIndex === -1 ) {
        // kdyz tam neni, pridej do historie
        setHistory(oldHistory => [...oldHistory, 
                                    {model: tmpActiveWord, 
                                    gameIndex: aW, 
                                    finished: false, 
                                    history: (shots[shots.length-1].length < tmpActiveWord.length)
                                              ? shots.slice(0, shots.length-2)
                                              : shots
                                  }]
                  );
      }
      shots.forEach((s, index) => {
//                        if ((index < shots.length-1) || !tmpSymbol) {
                        if (index < shots.length) {
                          const [newRightLetter, newMisplaceLetter, newWrongLetter]: string[][] = 
                          CheckLetterGame({
                            activeWord: tmpActiveWord,  
                            newWord: s.split(''),    
                            rightLetter: tmpRightLetter,
                            misplaceLetter: tmpMisplaceLetter,
                            wrongLetter: tmpWrongLetter
                          });
                          console.log(newRightLetter, newMisplaceLetter, newWrongLetter);
                          tmpRightLetter = newRightLetter;
                          tmpMisplaceLetter = newMisplaceLetter;
                          tmpWrongLetter = newWrongLetter;
                        }
                    });
      setRightLetter(tmpRightLetter);
      setMisplaceLetter(tmpMisplaceLetter);
      setWrongLetter(tmpWrongLetter);
      console.log('Nova pole: ', tmpRightLetter, tmpMisplaceLetter, tmpWrongLetter);

      settingAutoFill(tmpActiveWord, shots);
      setNumberActiveInput(0);
      setFinish(false);
      setErrorText('');
      setContinuePlay(true);
      if (shots[shots.length-1].length < tmpActiveWord.length) {
        console.log('Meli bychom to zkratit ... :-( Sem to nema lezt!!');
        shots.slice(0, shots.length-2);
      }
    }
  }

  useEffect(() => {
    if ((continueAW > -1) && 
        (slovaZDB) && 
        (slovaZDB?.slova.length > 0) &&  
        (pointerSlova === -1) //&&
//        (slovaZDB?.slova[0].length === letterCount)
      ) {
      const tmpPointer = slovaZDB.idSlov.findIndex(id => (id === continueAW));
      setPointerSlova((tmpPointer !== undefined && tmpPointer >= 0) ? tmpPointer : -1);
  
      if (tmpPointer !== -1) {
        continueGame(continueAW, continueShots);
      } else {
        setErrorText('Error: word not found');
      }
    }
  }, [slovaZDB]);

  const waitForSlovaZDB = async () => {
    while (!slovaZDB || (slovaZDB.slova.length === 0) && (slovaZDB.slova[0].length !== letterCount)) {
      console.log('Waiting for slovaZDB to be loaded...');
      await new Promise(resolve => setTimeout(resolve, 100)); // Čekání 100 ms
    }
  };

  const handleClickContinue = async (aW: number, length: number, shots : string[]) => {
    console.log('Continue: ' + aW + ', a delky: ' + length);
    setStatisticsGame(false);
    if (letterCount !== length) {
      // delka se neshoduje s nastavenim, musime nahrat slova z DB
      setChangeLength(true);
      setLetterCount(length);
      setContinueAW(aW);
      setContinueShots(shots);


      await new Promise<void>((resolve) => {
        const checkLengthChange = () => {
          if (!changeLength) {
            resolve();
          } else {
            setTimeout(checkLengthChange, 100); // Polling každých 100 ms
          }
        };
        checkLengthChange();
      });
    }

    await waitForSlovaZDB();
    continueGame(aW, shots);

  }

  const handleRulesGame = () => {
    setRulesGame(!rulesGame);
    setViewHistory(false);
    setShowSettings(false); 
    setActiveWord('');
    setStatisticsGame(false);
  }

  const handleStatisticsClick = () => {
    setRulesGame(false);
    setViewHistory(false);
    setStatisticsGame(!statisticsGame);
    setShowSettings(false);
    setActiveWord('');
  }

  return (
    <>
      <UserContext.Provider value={{...login }}> 
      <div className="app-container">
        <div className="header">
          <div className="title-bar">Snake-words</div>
            <div className="menu-bar">
              <div className="menu-button">&#9776;
                <div className="dropdown-content">
                    {((login.id !==0)  && ((activeWord.length === 0)|| (finish))) &&  
                      <>
                        <a href="#" onClick={handleSettingsClick} >Settings</a>
                        <a href="#" onClick={handleStatisticsClick} >Statistics</a>
                        <a href="#" onClick={handleHistoryClick} >History</a>
                      </>
                    }
                    <a href="#" onClick={handleRulesGame}>Game rules</a>
                </div>
              </div>
              { ((!loginNow) && (!registrationNew) && (login.id === 0)) &&
                  <button 
                    className='login'
                    onClick={loginButton}>
                    Login
                  </button> 
              }
              {  ((registrationNew) && (loginNow)) && 
                    <button 
                    className='login'
                    onClick={registrationButton}>
                    Registration
                  </button> 
              }
              { (login.id !== 0) && 
                <> {login.userName} 
                  <button 
                    className='logout'
                    onClick={logoutButton}>
                    Logout
                  </button>
                </>
              }
              { ((login.id !== 0) && (slovaZDB.slova.length > 0)) &&
                  <button 
                      className={finish ? "new-game" : "cancel-game"}
                      onClick={choiceModel}>
                    {finish ? 'New game' : 'Cancel'}
                  </button>
              }
            </div>
          </div>
          { (loginNow) &&
                <LoginPage onClickLogin={handleClickLogin} onClickRegistration={registrationButton} />
          }
          { (registrationNew) &&
            <RegistrationPage onClickRegistration={handleClickRegistration} /> 
          }
          {(activeWord.length > 0) && 
            <>
              <div >
                <Deskboard 
                    sign={sign} 
                    numberActiveInput={numberActiveInput}  
                    model={activeWord} 
                    continueShots={continuePlay&& 
                                      (history.findIndex(h => (h.model === activeWord)) !== undefined) 
                                          ? history[history.findIndex(h => (h.model === activeWord))].history
                                          : undefined
                                  }
//                    autoCorrect={login.autoCorrect}
                    onChangeInputAuto={onChangeInputAuto} 
                    onChangeInput={onChangeInput} 
                    onSubmitWord={onSubmitWord}
                />
              </div>
              {(!finish) && 
                <div className="content">
                  <Keyboard 
                      rightSign={rightLetter} 
                      wrongSign={wrongLetter} 
                      misplaceSign={misplaceLetter}
                      onChange={handleChangeSign}
                  />
                </div>
              }
            </>
          }
          {(showSettings) && 
            <GameSettings handleSubmit={handleSubmitSettings} cancelSettings={handleSettingsCancel} />
          }
          {((login.id > 0) && viewHistory) && 
            <GameHistory user={login} continueWord={handleClickContinue} />
          }
          {(rulesGame) && 
            <RulesGame onClickBack={handleRulesGame}/>
          }
          {(statisticsGame) && 
            <StatisticsGame />
          }
          {errorText}
        </div>
        <div className="footer">
          Snake-words, created by Lucie Struplova, 2024
        </div>
      </UserContext.Provider>    
    </>
  )
}

export default App;
