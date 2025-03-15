import equal from "fast-deep-equal";
import { useEffect, useState } from "react";
 
interface ActGame {
    model: string;  // hadane slovo
    shots: string[]; // seznam pokusu o uhodnuti
}

interface WordProps {
    sign: string[];
    onFinish: (b: boolean) => void;
}

const ActiveGame: React.FC<WordProps> = ({ sign, onFinish }) => {
    const [ag, setAG] = useState <ActGame>({model: 'tests', shots: ['']});

    const equalWord = () => {

        const concatSign: string = sign.join('');
        const areEqual = equal(concatSign, ag.model);
        console.log('Porovnani hadaneho slova : ' + areEqual);
        const newShots: string[] = [...ag.shots, concatSign];
        setAG(oldAG => ({...oldAG, shots: newShots}));
        onFinish(areEqual);
    }
    
    useEffect (() => {
        equalWord();
    }, []);

    return (
        <>
        <div>{sign}</div>
        </>
    );
}

export default ActiveGame;