import { useRef, useEffect, useState } from "react";
import OneLetter from "./oneletter/OneLetter";
import { Word } from "../../models/AppModels";
import './style.css';

import equal from "fast-deep-equal";
import { ActGame } from "../data/Data";
import Tryboard from "./tryboard/Tryboard";

interface DeskboardProps {
  sign: Word;
  numberActiveInput: number;
  model: string;
  continueShots?: string[];
//  autoCorrect: boolean;
  onChangeInputAuto: (s: string, n: number) => void;
  onChangeInput: (n: number) => void;
  onSubmitWord: (b: boolean, shots: string[]) => void;
}

const Deskboard: React.FC<DeskboardProps> = ({ sign, numberActiveInput, model, continueShots, /*autoCorrect, */ onChangeInputAuto, onChangeInput, onSubmitWord}) => {
  //const [numberActiveInput, setNumberActiveInput] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null!);
  const [fill, setFill] = useState<boolean>(false);
  const [ag, setAG] = useState <ActGame>({model: model, shots: (continueShots === undefined) ? [] : continueShots, finish: false});
  const count: number = model.length;

  useEffect(() => {
    inputRefs.current[0]?.focus();

/*    console.log('continueShots:' + continueShots + ', sign.word=' + sign.word + '.');
    if (continueShots && continueShots[continueShots.length-1].length !== model.length) {
      sign.word = [...continueShots[continueShots.length - 1].split('')];
    }
    if (sign.word.length === 0) { 
      sign.word = Array(model.length).fill(''); 
    }
    const tmpSign: Word = {...sign, word: sign.word.map(s => (s === '') ? '': s)};
    sign = tmpSign; */  
  }, []);

  useEffect(() => {
  }, []);

  const fillAllInputs = () => {
    const emptyIndex = sign.word.find(sw => sw === '');
    setFill (emptyIndex === undefined);
  }

  const equalWord = () => {
    const concatSign: string = sign.word.join('').toUpperCase();
    const areEqual = equal(concatSign, ag.model.toUpperCase());
    const newShots: string[] = [...ag.shots, concatSign];
    setAG(oldAG => ({...oldAG, shots: newShots, finish: areEqual}));
    console.log('areEqual je: ' +  areEqual + ' a cocatSign=' + concatSign + ' , ag.model: ' + ag.model);
    return(areEqual);
  }

  const handleSubmit = () => {
    if (fill) {
        console.log("Odeslano: " + sign.word);
        onSubmitWord(equalWord(), ag.shots);
      }
  }

  /** Zmeni hodnotu. Posune focus, ale jen pokud to neni delete, nebo tab */
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
//    console.log("Deskboard: " + e.target.value);
    fillAllInputs();
    const nextIndex = (e.target.value===''? index: index + 1) ;
    
    if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex]?.focus();
    }
//    setNumberActiveInput(nextIndex);
    onChangeInputAuto(e.target.value, nextIndex <= count ? nextIndex: count);
  }

  useEffect(() => {
    if (numberActiveInput >= 0 && numberActiveInput < inputRefs.current.length) {
        inputRefs.current[numberActiveInput]?.focus();
    }
    fillAllInputs();
  }, [numberActiveInput, sign]);

  useEffect(() => {
    if (ag.model !== model) {
      // dalsi hra, nastav pocatecni hodnoty
      setAG({model: model, finish: false, shots: []})
    }
  },[model]);

  /** Pouziji v pripade, ze uzivatel rucne presune focus */
  const handleClick = (index: number) => {
    onChangeInput(index);
  }

  const specHandleClick = (index: number, key: string) => { 
    fillAllInputs();

    // Tento řádek určuje nextIndex pro focus, pokud je to Delete nebo cokoli jineho, tak zustan na miste
    let nextIndex: number = index;
    if (key === 'Tab') {
      nextIndex++
    } 

    if (nextIndex >= 0 && nextIndex < inputRefs.current.length) {
      inputRefs.current[nextIndex]?.focus();
      onChangeInput(nextIndex); // aktualizace čísla aktivního inputu
    }
  }

  const handleReset = () => {
    // vymaze vsechna vlozena pismena
    inputRefs.current[0]?.focus();
    onChangeInput(0);
    setFill(false);
    sign.word = Array(model.length).fill('');
  }

  return(
      <>
        <Tryboard agShots={ag.shots} model={ag.model} />
        
        <hr />     
        {((model.length!==0) && (!ag.finish)) ? 
          <>  
            <div className="line">
              {/* {autoCorrect&&
                  <button className= "circle-button" title="Auto correct fill words">Ⓐ</button>
              } */}
              {Array.from({ length: count }).map((_, index) => (
                <OneLetter 
                  key={index} 
                  value={sign.word[index]}
                  ref={(el) => (inputRefs.current[index] = el)} 
                  onChange={(e) => handleChangeInput(e, index)}
                  onClick={() => handleClick(index)}
                  onSpecKey={() => specHandleClick(index, '')}  // potreba posunout na Ok ne na index, pokud je to na konci - dodelat!!
                />
              ))}   
              <button className="button-ok" type="submit" ref={buttonRef} onClick={handleSubmit} disabled={!fill}> Ok</button> 
              <button className="button-clear" type="reset" onClick={handleReset} disabled={ag.finish}> Clear</button> 
            </div>
          </> : 
          ''
        }
      </>
    );
}

export default Deskboard;
