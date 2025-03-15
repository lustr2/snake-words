import { UserSettings } from "../components/context/SettingsContext";
import { LetterObject } from "../components/data/Data";
import { SlovaZDB, Word } from "../models/AppModels";

export const updateGameOnDb = async(
    fin: boolean, 
    shots: string[], 
    login: UserSettings, 
    pointerSlova: number, 
    slovaZDB: SlovaZDB ,
    setSlovaZDB: React.Dispatch<React.SetStateAction<SlovaZDB>>, 
    setErrorText: React.Dispatch<React.SetStateAction<string>>
  ) => {

  console.log('Zapisujeme do db ...');
  console.log('Posilame: ' + shots + ' finish: ' + fin);
  const indexSlova: number = ((pointerSlova !== -1) ? slovaZDB.idSlov[pointerSlova] : 0);
  console.log('indexSlova pred update db: ' + indexSlova);
  
  console.log('JSON body:', JSON.stringify({
    idWord: indexSlova,
    idUser: login.id,
    attempt: shots,
    done: fin
  }));
      
  try {
    const response = await fetch('/api/add_dataH', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idWord: indexSlova,
        idUser: login.id,
        attempt: shots,
        done: fin
      }),
      }
    );
    
    console.log('Status code:', response.status);
    const responseBody = await response.text(); 

    if ((response.status === 201) || (response.status === 302)) {
      if (history.length === 0) {
        console.log('Uplne prazdne history! => Chybi zapsani do history!!!');
      } else {
//          console.log('Pointer =' + pointerSlova + ' a finished je = ' + history[history.length-1].finished + ' a fin je: ' + fin);
        setSlovaZDB(oldSlova => ({ ... oldSlova, userPlayed: [...oldSlova.userPlayed.slice(0, pointerSlova), 
          fin, ...oldSlova.userPlayed.slice(pointerSlova + 1)] }));
      }
    } else {
      // vratit do formulare a vypsat chybu ... 
      setErrorText(responseBody);
    }
  } catch (ex) {
    console.log("Chyba pri update: " + ex);
  }    

}

 export const updateHistory = (
    newHistory: string[], 
    fin : boolean,
    activeWord: string, 
    sign: Word, 
    history: LetterObject[],
    setHistory: React.Dispatch<React.SetStateAction<LetterObject[]>>,
    pointerSlova: number,
    login: UserSettings,
    slovaZDB: SlovaZDB,
    setSlovaZDB: React.Dispatch<React.SetStateAction<SlovaZDB>>, 
    setErrorText: React.Dispatch<React.SetStateAction<string>>,
    updateGameOnDb: (
        fin: boolean, 
        shots: string[], 
        login: UserSettings, 
        pointerSlova: number, 
        slovaZDB: SlovaZDB, 
        setSlovaZDB: React.Dispatch<React.SetStateAction<SlovaZDB>>, 
        setErrorText: React.Dispatch<React.SetStateAction<string>>) => void
  ) => {

  const s = [sign.word.join("")];
  if (history.find((i) => i.model === activeWord) === undefined) {
    setHistory(oldHis => [...oldHis, {model : activeWord, finished: fin, gameIndex: slovaZDB!.idSlov[pointerSlova], history: s}]);
  } else {
    setHistory(oldHistory => 
      oldHistory.map(h => 
        h.model === activeWord ? { ...h, finished: fin, history: [...newHistory, ...s]} : h)
    );
  }
  // poslat do db
  updateGameOnDb(fin, [...newHistory, ...s], login, pointerSlova, slovaZDB, setSlovaZDB, setErrorText);

};
