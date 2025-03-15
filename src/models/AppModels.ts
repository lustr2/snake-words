
import { StatesType } from '../components/data/Data';

export interface Word {
    word: string[];
    states: StatesType;
    activeFocus: number;
}
  
export interface SlovaZDB {
    slova: string[];
    idSlov: number[];
    userPlayed: boolean[];
}

export interface HistoryUserPerGame {
    id: number;
    idWord: number;         // id game of db data_history
    word: string;
    length: number;
    attempt: string[];  // attempt of db
    done: boolean;
}  