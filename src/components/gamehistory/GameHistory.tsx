import { useEffect, useState } from 'react';
import Tabs from '../tabs/Tabs';
import { ViewOptionDb } from '../../utils/OptionsLengthValue';
import { UserSettings } from '../context/SettingsContext';
import { HistoryUserPerGame } from '../../models/AppModels';
import './style.css';
//import OneLetter from '../deskboard/oneletter/OneLetter';
//import equal from 'fast-deep-equal';
//import { states } from '../data/Data';
import Tryboard from '../deskboard/tryboard/Tryboard';

interface GameHistoryProps {
  user: UserSettings;
  continueWord: (lengthWord: number, idWord: number, shots: string[]) => void;
}

const GameHistory: React.FC<GameHistoryProps> = ({ user, continueWord }) => {
	const [activeTab, setActiveTab] = useState<number>(0);
  const [tabNames, setTabNames] = useState<string[]>([]);
  const [historyGame, setHistoryGame] = useState<HistoryUserPerGame[][]>([]);
  const [activeWord, setActiveWord] = useState<number>(-1);

	const handleTabChange = (newActiveTab:number) => {
		setActiveTab(newActiveTab);
    setActiveWord(-1);
//    if (historyGame[newActiveTab]) {
//      console.log(`Sub-array at index ${newActiveTab} has length: ${historyGame[newActiveTab].length}`);
//    }
	}

  useEffect (() => {

    const fetchData = async() => {
      const [optVal, errText] = await ViewOptionDb();
      if (errText === '') {
          const optValString: string[] = optVal?.map(o => o.toString());
          setTabNames([...optValString]);
      } else {
          console.log(errText);
      }
    }

    fetchData();
  }, []); 
      
  
  useEffect (() => {
    if (tabNames.length > 0) {
      const newActiveTab = tabNames.indexOf(user.actLengthWords.toString());
//      console.log('Nasli jsme v tabName na pozici: ' + newActiveTab + ' a tabNames[pozice]=' + tabNames[newActiveTab]);
      setActiveTab(newActiveTab); 

      const fetchDataHistory = async() => {
//          console.log(`/api/view_played/${user.id}`);
        try {
          const response = await fetch(`/api/view_played/${user.id}`, {
              method: 'GET',
              headers: {
              'Content-Type': 'application/json',
              },
              }
          );
          if (response.status === 200) {
              const responseOpt = await response.json();
              const newHistoryData: HistoryUserPerGame[] = responseOpt.map((r: { id: number; idWord: number; word: string; attempt: string[]; done: boolean; }) => ({ 
                  id: r.id,
                  idWord: r.idWord, 
                  word: r.word,
                  length: r.word.length,
                  attempt: r.attempt,
                  done: r.done
                }));

              if (newHistoryData.length > 0) {
                const sortedHistory = tabNames.map(tabLength => 
                  newHistoryData.flat().filter(game => game.length === parseInt(tabLength))
                );
                console.log(sortedHistory);
                setHistoryGame(sortedHistory as HistoryUserPerGame[][]);
              } else {
                console.log('tabNames=' + tabNames.length);
              }

          } else {
              // vratit do formulare a vypsat chybu ... 
              const responseOpt = await response.text();
              console.log(responseOpt);
          }
        } catch (ex) {
          console.log("Chyba pri cteni view options .... : " + tabNames + ', ' + ex);
          return [[], 'Chyba pri cteni view options ....'];
        }    
      }

      fetchDataHistory();
    }
  }, [tabNames]);

  const handleClickWord = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.value);
    setActiveWord(parseInt(e.currentTarget.value));
  }

  // const equalSign = (w: string, model: string[], i: number) => {
  //   if (equal(w, model[i])) {
  //     return (states[2]);
  //   } else {
  //     if (model.includes(w)) {
  //       return(states[3]);
  //     } else {
  //       return(states[1]);
  //     }
  //   }
  // }

  const handleClickBack = () => {
    setActiveWord(-1);
  }

  const handleClickContinue = (idWord: number, attempt: string[]) => {
    continueWord(activeWord, idWord, attempt);
  }

  return (
      <>
        <div className="body-title">History games</div>
        <div className='tab-title'> 
          <Tabs tabNames={tabNames} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <div className='tab-view'>
          {(activeWord === -1) 
            ? (((tabNames.length) > 0 && (historyGame.length > 0)) 
                  ? historyGame[activeTab].map(h => <button className={`${(h.done) ? 'game-button ok' : 'game-button ko'}`} 
                                                            key={h.id} 
                                                            value={h.idWord} 
                                                            onClick={handleClickWord}
                                                    >
                                                      Word no. {h.idWord}
                                                    </button>) 
                  : <div className="body-title">Loading ... </div> 
              ) 
            : <div className='body-title'>
                <div> Word No: {historyGame[activeTab][historyGame[activeTab].findIndex(h => h.idWord===activeWord)].idWord } </div>
                  <div>  { !historyGame[activeTab][historyGame[activeTab].findIndex(h => h.idWord===activeWord)].done &&
//                    ? historyGame[activeTab][historyGame[activeTab].findIndex(h => h.idWord===activeWord)].attempt.map((a, i) => <div key={i}>{i+1}. {a} </div>) 
                            ' Nedokonceno'
                         }
                  </div>
              </div>
          }
          {(historyGame[activeTab]?.length === 0)&&
             <div className="body-title">No played words .... </div>
          }
          <div className='print-attempt'>
            {(activeWord > 0)&& 
                <div className="line-container">
{                  <Tryboard agShots={historyGame[activeTab][historyGame[activeTab].findIndex(h => h.idWord===activeWord)].attempt} model={historyGame[activeTab][historyGame[activeTab].findIndex(h => h.idWord===activeWord)].word}  /> }
                  <div>
                      <button className='login' onClick={handleClickBack}>Back</button>
                      {(!historyGame[activeTab][historyGame[activeTab].findIndex(h => h.idWord===activeWord)].done)&&
                          <button className='continue-game' 
                                  value={activeWord} 
                                  onClick={() => 
                                    handleClickContinue(historyGame[activeTab][historyGame[activeTab].findIndex(h => h.idWord===activeWord)].word.length,
                                                        historyGame[activeTab][historyGame[activeTab].findIndex(h => h.idWord===activeWord)].attempt)}
                          >Continue</button>
                      }
                  </div>
                </div>
            }
          </div>  
        </div>
      </>
  );
}

export default GameHistory;