import { useEffect, useState } from 'react';
import './style.css';

interface LettersProps {
    letter: string;
    stateLetter: string;
    onClickLetter: (k: string) => void;
//    newGame: boolean;
}

const Letter: React.FC<LettersProps>= ({ letter, stateLetter, onClickLetter }) => {

    const [disLet, setdisLet] = useState<boolean>(false);

    useEffect (() => {
        setdisLet(stateLetter === 'disabled');
    },[stateLetter]);

    const handleClick = () => {
        if (!disLet) {
            onClickLetter(letter);
        }
    }

    return (
      <>
        <button 
            className={`button-pismeno button-pismeno-${stateLetter}`} 
            onClick={handleClick} 
            disabled={disLet}
            title={letter === ' ' ? stateLetter : letter}
            >{letter}
        </button>
      </>
    )
}

export default Letter;