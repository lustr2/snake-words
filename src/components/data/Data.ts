// export const ceskaSlovaTest: string[][] = [
//     ['ANAPA', 'ALBUM', 'AKORD', 'AKTIV', 'ASTRA'], // A
//     ['BRATR', 'BINEC', 'BUKVA', 'BRADA', 'BLOKY'], // B
//     ['CESTA', 'CIFRA', 'CELTA', 'CENIT', 'CETKA'], // C
//     ['DUBEN', 'DUSOT', 'DRAMA', 'DORAZ', 'DIVAN'], // D
//     ['EBENY', 'EPOXY', 'EMAIL', 'ETAPA', 'EFEKT'], // E
//     ['FILMY', 'FIALA', 'FYZIK', 'FOTKA', 'FLEKY'], // F
//     ['GOLEM', 'GANGY', 'GOTIK', 'GRAFY', 'GRILY'], // G
//     ['HOTEL', 'HOUBA', 'HUDBA', 'HOROR', 'HUMUS'], // H
//     ['IGLOO', 'IKONA', 'INDEX', 'INDIE', 'ISKRA'], // I
//     ['JAMKA', 'JETEL', 'JEDLE', 'JITRO', 'JEDEN'], // J
//     ['KOSTI', 'KOULE', 'KULMA', 'KOZEL', 'KOKOS'], // K
//     ['LETKA', 'LOUKA', 'LISTY', 'LAZAR', 'LYSKA'], // L 
//     ['MISKA', 'MOUKA', 'MRAKY', 'METAT', 'MODEL'], // M
//     ['NOSIT', 'NOREK', 'NUDLE', 'NUDIT', 'NICKA'], // N
// ];

export const keyboardLayout = [
    ['Ě', 'Š', 'Č', 'Ř', 'Ž', 'Ý', 'Á', 'Í', 'É', 'Ú', 'Ů'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

//type KeyboardType = (typeof keyboardLayout)[number];

export const states = ['free', 'disabled', 'right', 'misplace'] as const;
export type StatesType = (typeof states)[number];

export interface LetterObject {
  model: string;  // hadane slovo popripade index do pole slov
  gameIndex: number;  /** index hry - id_word z db */
  history: string[]; /**  historie v ramci jedne hry, pridavame na konec*/
  finished: boolean; /** zda je slovo dokonceno (uhadnuto na 100%) */
}

export interface ActGame {
    model: string;  // hadane slovo
    shots: string[]; // seznam pokusu o uhodnuti
    finish: boolean;
}

 
