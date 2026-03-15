import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface WordStatsData {
    idUser: number, 
    userName: string,
    attempt: string[], 
    countAttempt: number,
    done: boolean
}

/*
interface AllWordsData {
    idWord: number,
    statsWord: WordStatsData[]
}
*/

interface LengthData {
    idWord: number,
    countUsers: number
}

interface WordStatsProps {
    lengthWord: number;
    back: () => void;
  }

const WordStats: React.FC<WordStatsProps> = ({ lengthWord, back }) => {
    const { t } = useTranslation();
    const [oneWordStats, setOneWordStats] = useState <WordStatsData[]>([]);
    const [pointerList, setPointerList] = useState<number>(0);
    const countList: number = 10;
  //  const [allWordsStats, setAllWordsStats] = useState<AllWordsData[]>([]);
    const [activeWordStats, setActiveWordStats] = useState<number>(0);
    const [lengthStats, setLengthStats] = useState<LengthData[]>([]);

    useEffect (() => {
        const generalWordStats = async() => {
            try {
                const response = await fetch(`/api/statsU/${activeWordStats}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const dataRes = await response.json();
                console.log(dataRes);
                if (response.status === 200) {
                    setOneWordStats( dataRes.map((d: { id_user: number; user_name: string; attempt: string[]; countattempt: number; done: boolean; }) => ({
                                        idUser: d.id_user,
                                        userName: d.user_name,
                                        attempt: d.attempt, 
                                        countAttempt: d.countattempt,
                                        done: d.done}))
                    );
                    console.log('OK');
                }

            } catch (err) {
                console.log("WordStats - error: " + err);
            }
        }
        
        generalWordStats();

    }, [activeWordStats]);

    useEffect (() => {
        const getDataByLength = async() => {
            try {
                const responseDataLength = await fetch(`/api/statsW/${lengthWord}`, 
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const dataLengthRes = await responseDataLength.json();
                if (responseDataLength.status === 200) {
                    console.log(dataLengthRes);
                    setLengthStats(dataLengthRes.map((d: { id_word: number; count_users: number; }) => ({
                                        idWord: d.id_word,
                                        countUsers: d.count_users}))
                    );
                } else {
                    console.log('No data v getDataByLength: ' + lengthWord);
                }

            } catch (err) {
                console.log('Chyba v getDataByLength: ' + err);
            }
        }

        getDataByLength();

    }, []);

    const handleNext = () => {
        if (oneWordStats.length > pointerList) {
            setPointerList(pointerList + countList);
        }
    }

    const handlePrev = () => {
        if (pointerList >= countList) {
            setPointerList(pointerList - countList);
        } else {
            setPointerList(0);
        }
    }
    
    const handleChooseWord = (n: number) => {
        setActiveWordStats(n);
    }

    const handleClickBack = () => {
        handleChooseWord(0);
        ((lengthStats.length === 0 ) || (activeWordStats === 0))&&
            back();
    }

    return (
        <>
            {((lengthStats.length > 0) && (activeWordStats === 0)) &&
                lengthStats.map((m, i) => <button className='new-game' title='Id Word (Count played users)' key={i} onClick={() => handleChooseWord(m.idWord)}>{m.idWord} ({m.countUsers})</button>)
                
            }
            {((oneWordStats.length > 0) && (activeWordStats > 0)) ? 
              <>
                <div className="table-container">
                    <table className="styled-table">
                        <caption> {t('stats.orderWord')}: {activeWordStats}</caption>
                        <tbody>
                            {oneWordStats.slice(pointerList, pointerList + countList).map((o, index) => (o.done === true)&&
                            <> 
                            <tr key={o.idUser}>
                                <td title={t('stats.order')}>{pointerList + index + 1}. </td>
                                <td title={t('stats.userName')}>{o.userName} </td>
                                <td title={t('stats.attempts')}>{o.countAttempt}</td>
                            </tr>
                            </>
                            )}
                            {(oneWordStats.filter(item => item.done === false).length > 0) && (oneWordStats.length <= (pointerList + 1)*countList)&&
                                <tr>
                                    <td title={t('stats.notDone')}>N</td>
                                    <td title={t('stats.notDoneUsers')}> {oneWordStats.filter(item => item.done === false).length}</td>
                                    <td></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div className="styled-table">
                    <button className={`login ${pointerList === 0 ? 'disabled' : ''}`} onClick={handlePrev} disabled={pointerList === 0}>←</button>
                    <button className={`login ${oneWordStats.length <= pointerList + countList ? 'disabled' : ''}`} onClick={handleNext} disabled={oneWordStats.length <= pointerList + countList}>→</button>
                </div>
                <div>
                    <button className='login' onClick={handleClickBack}>{t('history.back')}</button>
                </div>
              </>
              : <>
                {
                  ((lengthStats.length === 0 ) && (activeWordStats === 0))&& <div>{t('stats.noData')} :-(</div>
                }
                <div>
                    <button className='login' onClick={handleClickBack}>{t('history.back')}</button>
                </div>
                </>
            }
        </>
    );
}

export default WordStats;