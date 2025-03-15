import { createContext } from "react";

export interface UserSettings {
    id: number;
    userName: string;
    actLengthWords: number;
    autoFill: boolean;  // automaticky doplni uz spravne uhadnuta pismena
//    autoCorrect: boolean;  // automaticky kontroluje, zda vkladane slovo je ve slovniku
  }
  
export const UserContext  = createContext<UserSettings> ({
    id: 0, 
    userName: '', 
    actLengthWords: 5, 
    autoFill: false,
//    autoCorrect: false,
});