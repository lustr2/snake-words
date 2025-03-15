import { useEffect, useState } from "react";

interface GlobalStatsProps {
    optLen: number[];
}

const GlobalStats: React.FC<GlobalStatsProps> = ({ optLen }) => {
    const [totalCount, setTotalCount] = useState <number>(-1);
    const [countUsers, setCountUsers] = useState <number>(-1);
    const [countDoneGames, setCountDoneGames] = useState <number>(-1);
    const [countDoneByLength, setCountDoneByLength] = useState <number[]>([]);

    useEffect (() => {
        const generalStatsGame = async() => {
            try {

                const responseTotalCount =  await fetch('/api/toco',
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const dataResGames = await responseTotalCount.json();
//                console.log(dataResGames);
                if (responseTotalCount.status === 200) {
                    setTotalCount(parseInt(dataResGames.totalCountGames));
                    setCountDoneGames(parseInt(dataResGames.totalCountDoneGame));
                }

                const responseCountUsers =  await fetch('/api/cous',
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const dataResUsers = await responseCountUsers.json();
                (parseInt(dataResUsers) > -1) &&
                    setCountUsers(parseInt(dataResUsers));

                const responseCountWords =  await fetch('/api/view_cowotr',
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const dataResWords = await responseCountWords.json();
                const newCount: number[] = [];
//                dataResWords.map((d, index: number) => (Number(d.wordLength) === Number(optLen[index])) ?  newCount[index] = d.count : -1) ;
                    dataResWords.forEach((d: { wordLength: number; count: number; }) => {
                    const index: number = optLen.indexOf(d.wordLength);
                    if (index !== -1) {
                        newCount[index] = d.count;
                    }
                });
//                console.log(dataResWords);
                setCountDoneByLength(newCount);

            } catch (err) {
                console.log("Chyba pri nacitani z db.");
            }
        }

        generalStatsGame();

    }, []);

    return (
        <>
            <div className="table-container">
                <table className="styled-table">
                    <caption>Global Statistics</caption>
                    <tbody>
                        <tr>
                            <td className="value-cell-l">Total games played:</td>
                            <td className="value-cell-r">{totalCount}</td>
                        </tr>
                        <tr>
                            <td className="value-cell-l">Completed/Incompleted games:</td>
                            <td className="value-cell-r">{countDoneGames}/{totalCount - countDoneGames}</td>
                        </tr>
                        <tr>
                            <td className="value-cell-l">Total registered players:</td>
                            <td className="value-cell-r">{countUsers}</td>
                        </tr>
                        <tr>
                            <td className="value-cell-l">Average of completed games per player:</td>
                            <td className="value-cell-r">{Math.round(countDoneGames / countUsers)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {(optLen.length > 0 && countDoneByLength.length > 0) &&
            <div className="table-container">
                <table className="styled-table">
                    <caption>Completed word length games:</caption>
                    <tbody>
                        <tr>
                            <td>Length: </td>

                        {optLen.map((o, index) => (
                            <td key={index}>{((o !== undefined) && (countDoneByLength[index]>=0)) ? o : ''}</td> // Zajistí zobrazení prázdné buňky
                        ))}
                        </tr>
                        <tr>
                            <td>Number: </td>

                        {optLen.map((_, index) => (
                            <td key={index}>{countDoneByLength[index] !== undefined ? countDoneByLength[index] : ''}</td> // Udržení stejné struktury s prázdnými hodnotami
                        ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            }
        </>
    );
}

export default GlobalStats;