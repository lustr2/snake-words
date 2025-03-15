import { useEffect, useState } from "react";
//import { UserSettings, UserContext } from "../context/SettingsContext";
import { ViewOptionDb } from "../../utils/OptionsLengthValue";
import Tabs from "../tabs/Tabs";
import GlobalStats from "./globalstats/GlobalStats";
import UserStats from "./userstats/UserStats";
import SignPost from "./signpost/SignPost";
import './style.css';

interface StatisticsGameProps {
}

const StatisticsGame: React.FC<StatisticsGameProps> = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const tabNames: string[] = ['Global', 'User', 'Word'];
    const [optionValue, setOptionValue] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState <boolean> (false);

   // const user: UserSettings = useContext(UserContext);

    const handleTabChange = (newActiveTab:number) => {
		setActiveTab(newActiveTab);
	}
    
    useEffect (() => {

        const fetchData = async() => {
            const [optVal, errText] = await ViewOptionDb();
            if (errText === '') {
                setOptionValue(optVal);
            } else {
                console.log(errText);
            }
        }

        fetchData();

    }, []); 

    useEffect (() => {
        (optionValue.length > 0) && 
        setIsLoaded(true);
    }, [optionValue]);

    return(
        <>
            <div className="body-title">Statistics game</div>
            <div className='tab-title'> 
                <Tabs tabNames={tabNames} activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
            <div className='tab-view'>
                {(activeTab === 0) && (isLoaded) &&
                    <GlobalStats key={activeTab} optLen={optionValue} />
                }
                {(activeTab === 1) && (isLoaded) &&
                    <UserStats key={activeTab} optLen={optionValue} />
                }
                {(activeTab === 2) && (isLoaded) &&
                   <SignPost key={activeTab} optLen={optionValue} />                  
                }
            </div>  
        </>
    );
}

export default StatisticsGame;