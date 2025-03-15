
interface RulesGameProps {
    onClickBack: () => void;
}

const RulesGame: React.FC<RulesGameProps> = ({ onClickBack }) => {

    const handleClickBack = () => {
        onClickBack();
    }

    return (
        <>
            <h3>Rules game Snake-words</h3>
            <div className="rules">
                <p><u>Pravidla:</u> <br />
                Jednoduche hadani pouze ceskych slov. Muzete si zvolit velikost slov, 
                ktere chcete hadat. Minimalni velikost slov jsou 4 pismena, 
                maximalni je aktualne na 11 pismenech. Pocet pokusu na uhodnuti 
                slova neni nijak omezen.</p>
                <p>Slova mohou byt v jednotnem i mnoznem cisle libovolneho slovniho druhu. 
                Pismeno "CH" je povazovano za 2 znaky. Pri pokusech uhodnout slovo neni nutne, aby davalo smysl. 
                (Napr. hadame slovo "FOUKÁ". Zadam HOUSX. Po odeslani se pokus vyhodnoti a pokracujete dalsim 
                pokusem, dokud jej neuhadnete, nebo nezavrete aplikaci).
                Pokud je pismeno ve slove na spravnem miste je podbarveno zelene, pokud je pismeno 
                ve slove, ale na spatnem miste, je podbarveno zlute. Pismeno, ktere se ve slove 
                nevyskytuje je podbarveno svetle sedive. Vsechna pismena lze az do vyreseni hadaneho 
                slova pouzit opakovane (i kdyz je sedive). Pokud je pismeno vicekrat ve slove a neuhodneme 
                vsechny jeho pozice spravne, bude v dalsim pokusu podbarveno zlute. 
                Pismena lze vepsat i primo z klavesnice. </p>
                <p>Lze odehrat libovolny pocet her za den. Slova jsou vybirana nahodne z nastavene 
                delky slova (Menu - Settings). Hadane slovo lze dohrat 
                kdykoli pozdeji. Vsechna odehrana i neodehrana slova lze najit v menu "Historie" 
                a po vybrani delky slova na nej kliknout na pokracovat nebo si prohlednout, jak 
                jsme jej resili. Jednou odehrane slovo jiz nelze nikdy hrat znovu. </p>
                <p><u>Nastaveni volitelnych vlastnosti: </u><br />
                Lze si nastavit delku hadanych slov 4-11 pismen a zda chceme, aby uhodnuta pismena 
                (pozice pismen v hadanem slove) se sama v dalsim pokusu vyplnila.
                </p>
                <p><u>Registrace:</u> <br />
                K tomu, aby jste mohli hrat je treba se zaregistrovat. 
                Registrace je dulezita pro fungovani aplikace, bez ni neni mozne 
                nastavovat a menit delku slov a vytvaret statistiky a historii odehranych her. 
                Nesbirame data o uzivateli (pouze uzivatelske jmeno, heslo, email) 
                a neodesilame zadne "newslettery". Email slouzi pouze pro obnoveni 
                uctu pri zapomenutem heslu. Nebo se lze prihlasit pres google ucet.</p>

                <p><u>Statistiky:</u> <br />
                    1. Globalni pres vsechny uzivatele<br />
                    2. Obecna osobni statistika uzivatele<br />
                    3. Podle delky slov. Seznam uzivatelu, kteri vybrane slovo hrali.<br />
                </p>
            </div>
            <button className='login' onClick={handleClickBack}>Back</button>
        </>
    )
}

export default RulesGame;