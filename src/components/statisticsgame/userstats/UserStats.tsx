import { useContext, useEffect, useState } from "react";
import { UserSettings, UserContext } from "../../context/SettingsContext";

interface UserStatsProps {
    optLen: number[]; 
}

const UserStats: React.FC<UserStatsProps> = ({ optLen }) => {
    const [totalGameUser, setTotalGameUser] = useState <number>(0);
    const [totalDoneGame, setTotalDoneGame] = useState <number>(0);
    const [countDoneByLengthT, setCountDoneByLengthT] = useState <number[]>([]);
    const [countDoneByLengthF, setCountDoneByLengthF] = useState <number[]>([]);


    const user: UserSettings = useContext(UserContext);

    useEffect (() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/dataU/${user.id}`, 
                  {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                  }
                );
                const dataResponse = await response.json();
                console.log(dataResponse);
                let c1 = 0;
                dataResponse.map((d: { done: boolean; }) => (d.done === true)&& c1++);
                setTotalGameUser(dataResponse.length);
                setTotalDoneGame(c1);

                const responseCountWords =  await fetch(`/api/view_played/${user.id}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const dataResWords = await responseCountWords.json();
                console.log('User stats: ');
                console.log(dataResWords);
                const newCountT: number[] =  Array(optLen.length).fill(0);
                const newCountF: number[] =  Array(optLen.length).fill(0);
                dataResWords.forEach((d: { word: string[]; done: boolean; }) => {
                    const index: number = optLen.indexOf(d.word.length);
                    if (index !== -1) {
                        (d.done === true) ? newCountT[index]++ : newCountF[index]++;
                    }
                });
                setCountDoneByLengthT(newCountT);
                setCountDoneByLengthF(newCountF);

            } catch (err) {
                console.log('Chyba pri nacitani osobnich statistik.');
            }
        }

        fetchUserData();

    }, []);

    return (
        <>
            <div className="table-container">
                <table className="styled-table">
                    <caption>Users table - {user.userName}</caption>
                    <tbody>
                        <tr>
                            <td className="value-cell-l">Total games played:</td>
                            <td className="value-cell-r">{totalGameUser}</td>
                        </tr>
                        <tr>
                            <td className="value-cell-l">Completed / Incompleted:</td>
                            <td className="value-cell-r">{totalDoneGame}/{totalGameUser-totalDoneGame}</td>
                        </tr>
                        </tbody>
                </table>
            </div>
            <div className="table-container">
                <table className="styled-table">
                    <caption>Completed/Incompleted games of user "{user.userName}" by word length:</caption>
                    <tbody>
                        <tr>
                            <td>Length: </td>
                            {optLen.map((o, index) => (
                                 <td key={index}>{(o !== undefined)&& o }</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Number: </td>
                            {optLen.map((_, index) => (
                                <td key={index}>{(countDoneByLengthT[index] !== undefined) ? countDoneByLengthT[index]+'/'+ countDoneByLengthF[index] : ''}</td> 
                             ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default UserStats;