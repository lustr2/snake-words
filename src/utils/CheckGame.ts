import equal from "fast-deep-equal";


interface CheckLetterGameI {
    activeWord: string;
    newWord: string[];
    rightLetter: string[];
    misplaceLetter: string[];
    wrongLetter: string[];
}

const CheckLetterGame = ({ activeWord, 
                           newWord, 
                           rightLetter, 
                           misplaceLetter, 
                           wrongLetter }: CheckLetterGameI): [string[], string[], string[]] => {

    /** Kontrola odeslanych znaku a nastaveni poli
  */
//  const choiceSignLetter = (newWord: string[]) => {

    let newRightLetter = [...rightLetter];
    let newMisplaceLetter = [...misplaceLetter];
    let newWrongLetter = [...wrongLetter];

//    console.log(activeWord, newWord, newRightLetter, newMisplaceLetter, newWrongLetter);
  
    newWord.forEach((n, index) => {
      // 1. prohledam Hadane slovo a zjistim, kolikrat se tam vyskytuje pismeno "n"
      const posNum = activeWord.split('').reduce((acc:number[], char, j) => (char === n ? [...acc, j] : acc), []); 
 
      if ((posNum.length === 0)) {
        if (!newWrongLetter.includes(n)) {  // funguje OK = pismeno tam neni ani jednoua zaroven jeste neni v poli wrongLett 
          newWrongLetter = [...newWrongLetter, n];
        }   // else neni potreba nic delat ... uz hotovo
      } else {
        if (posNum.length === 1) { // 
          if (equal(activeWord.split('')[index], n) && (!newRightLetter.includes(n))) { // je na spravne pozici
//            console.log('# 1 *** ' + n);
            if (newMisplaceLetter.includes(n)) {   // funguje OK =  kdyz uz je ale i v misplace, tak ho odstran
//              console.log(' # 2 *** ' + n);
              newMisplaceLetter = newMisplaceLetter.filter(char => char !== n);
            }
            newRightLetter = [...newRightLetter, n];
          } else {    // neni na spravne pozici, ale je tam jen 1x, pridame do misplace, pokud uz neni v rightLetter(uzivatel ho mohl schvalne dat spratne)

            if (!newRightLetter.includes(n))  {
              if (!newMisplaceLetter.includes(n)) {
//                console.log('# 3 Je tam 1x, neni v RL ani v MPL (je na spatny pozici -> pridame do MPL) *** ' + n);
                newMisplaceLetter = [...newMisplaceLetter, n];
              // } else {
              //   // uz je v MPL => neni potreba nic delat
              //   console.log('# 4 *** nic' + n);
              }
            } else {
              if (newMisplaceLetter.includes(n)) {
                // je v RL a je v MPL =>  odstran z MPL
 //               console.log('# 5 *** ' + n);
                newMisplaceLetter = newMisplaceLetter.filter(char => char !== n); 
              // } else {
              //   // je v RL, ale neni v MPL -> neni potreba nic delat
              //   console.log('# 6 *** nic' + n);
              }
            }
          }       
        } else {  // pismeno je tam vicekrat
          // je na vsech pozicich posNum?
          const isCorrect = posNum.every(is => newWord[is] === activeWord[is]);
          if ( isCorrect) {
            // - Ano => a je v misplace? -> ANO odstran jej z Misplace, NE - nic neni treba
            if (newMisplaceLetter.includes(n)) {
              newMisplaceLetter = newMisplaceLetter.filter(char => char !== n);
            }
            if (!newRightLetter.includes(n)) {  
              // muze se stat, ze trefil vsechny pozice tohoto pismena najednou a napoprve -> pridej ho tedy do rightLett  
              newRightLetter = [...newRightLetter, n]; 
            }
          } else {
            // - Ne => pridej do misplace, pokud tam uz neni + a pokud je na spravne pozici, pridej jej do rightLetter
            if (equal(activeWord.split('')[index], n) && (!newRightLetter.includes(n)))  {
            // je i na spravne pozici
              newRightLetter = [...newRightLetter, n];
            }
            if (!newMisplaceLetter.includes(n)) {
              newMisplaceLetter = [...newMisplaceLetter, n];
            }
          }
        }
      }
    });
//    setRightLetter(newRightLetter);
//    setMisplaceLetter(newMisplaceLetter);
//    setWrongLetter(newWrongLetter);
//  }
    if (newWord.length < activeWord.length) {
        console.log('Asi bylo dano continue a posledni neuplne slovo nezobrazuji ... vratime to predchozi');
      return [newRightLetter, newMisplaceLetter, newWrongLetter];
    }


    return [newRightLetter, newMisplaceLetter, newWrongLetter];
}

export default CheckLetterGame;
