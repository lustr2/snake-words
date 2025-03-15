import Letter from "./Letter";
import { states, keyboardLayout } from "../data/Data";

interface KeyBoardPropsI {
    rightSign: string[];
    wrongSign: string[];
    misplaceSign: string[];
    onChange: (s: string) => void;
}

const Keyboard: React.FC<KeyBoardPropsI> = ({ rightSign, wrongSign, misplaceSign, onChange }) => {
//    type KeyboardType = (typeof keyboardLayout)[number];

//    const states = ['free', 'disabled', 'right', 'misplace'] as const;
//    type StatesType = (typeof states)[number];

    const onClickLetter = (key: string) => {
 //       console.log('Stisteno pismeno: ' + key);
        onChange(key);
    }

    return (
        <>
          {
            keyboardLayout.map((row, i) => (
                <div  className="keyboard-row" key={i}>
                    {row.map((k, index) => (
                        <Letter 
                            key={i*10+index} 
                            letter={k} 
                            stateLetter={(rightSign.includes(k) && !misplaceSign.includes(k)) ? 
                                            states[2] : 
                                            (wrongSign.includes(k))? 
                                                states[1] :
                                                (misplaceSign.includes(k))?
                                                    states[3] :
                                                    states[0]
                                            } 
                            onClickLetter={onClickLetter} />
                     ))}
                </div>
            ))
          }
          <div className='legenda'>Legenda:
            <Letter letter=' ' stateLetter={states[0]} onClickLetter={onClickLetter} />
            <Letter letter=' ' stateLetter={states[1]} onClickLetter={onClickLetter} />
            <Letter letter=' ' stateLetter={states[2]} onClickLetter={onClickLetter} />
            <Letter letter=' ' stateLetter={states[3]} onClickLetter={onClickLetter} />
          </div>
        </>
    );
}

export default Keyboard;