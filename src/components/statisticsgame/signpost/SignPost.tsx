import { useState } from "react";
import WordStats from "../wordstats/WordStats";
import '../../../index.css';

interface SignPostProps {
    optLen: number[];

}

const SignPost: React.FC<SignPostProps> = ({ optLen }) => {
    const [home, setHome] = useState<number>(0);

    const handleClickPost = (n: number) => {
        setHome(n);
    }

    const handleClickBack = () => {
        setHome(0);
    }

    return (
        <>
          <div>
            {(home > 0) ?
                <WordStats lengthWord={home} back={handleClickBack} />
                :
                <>  
                    <label className="tab-title">Choose length: </label>
                    {optLen.map((o, index) => 
                        <button className="login" key={index} onClick={() => handleClickPost(o)}>{o}</button>
                    )}
                </>
            }
          </div>
        </>
    );
}

export default SignPost;