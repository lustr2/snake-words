
export const ViewOptionDb = async(): Promise<[number[], string]> => {

    try {
      const response = await fetch('/api/view_words', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        }
      );
      if (response.status === 200) {
        const responseOpt = await response.json();
        const wordLengths = responseOpt.map((i : { wordLength: number }) => i.wordLength);
//            console.log(wordLengths);
//        setOptionValue(wordLengths);
        return [wordLengths, ''];
      } else {
        // vratit do formulare a vypsat chybu ... 
        const responseOpt = await response.text();
        console.log(responseOpt);
        return [[], responseOpt];
      }
    } catch (ex) {
      console.log("Chyba pri cteni view options: " + ex);
      return [[], 'Chyba pri cteni view options'];
    }    
}
