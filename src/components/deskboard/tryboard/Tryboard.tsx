import equal from "fast-deep-equal";
import { states } from "../../data/Data";
import OneLetter from "../oneletter/OneLetter";

interface TryboardProps {
    agShots: string[];
    model: string;
    ref?: React.MutableRefObject<(HTMLInputElement | null)[]> ;
    handleChangeInput?: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    handleClick?: (index: number) => void;
    specHandleClick?: (index: number) => void;
}

const Tryboard : React.FC<TryboardProps> = ({ agShots, model, ref, handleChangeInput, handleClick, specHandleClick }) => {

    const equalSign = (w: string, model: string[], i: number) => {
        if (equal(w, model[i].toUpperCase())) {
          return (states[2]);
        } else {
          if (model.includes(w)) {
            return(states[3]);
          } else {
            return(states[1]);
          }
        }
    }
    
    return(
        <>
          <div className="line-container">
            {Array.from({ length: agShots.length }).map((_, index) => (
            <div className="line" key={index}>
                <span className="line-number">{index + 1}</span>
                <div className="letters">
                    {(agShots[index].split('')).map((w, i) => 
                        <OneLetter 
                            key={i} 
                            value={(w === '-') ? '' : w}
                            status={equalSign(w, model.split(''), i)}
                            ref={(el) => { if (ref?.current && el) ref.current[index * agShots[index].length + i] = el; }}
                            onChange={(e) => handleChangeInput&& handleChangeInput(e, index)}
                            onClick={() => handleClick&& handleClick(index)}
                            onSpecKey={() => specHandleClick&& specHandleClick(index)}  // potreba posunout na Ok ne na index, pokud je to na konci - dodelat!!
                        />
                    )}
                </div>
            </div>
            ))}  
          </div>
        </>
    )    
}

export default Tryboard;

