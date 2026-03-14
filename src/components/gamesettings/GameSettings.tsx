import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { UserSettings, UserContext } from "../context/SettingsContext";
import { ViewOptionDb } from "../../utils/OptionsLengthValue";
import '../loginpage/style.css';

interface GameSettingsI {
    handleSubmit: (s: UserSettings, chLen: boolean, errText: string) => void
    cancelSettings: () => void;
}

const GameSettings: React.FC<GameSettingsI>  = ({ handleSubmit, cancelSettings }) => {
    const { t, i18n } = useTranslation();
    const user: UserSettings = useContext(UserContext);

    const [settings, setSettings] = useState<UserSettings>({
        id: user.id, 
        userName: user.userName, 
        autoFill: user.autoFill, 
        actLengthWords: user.actLengthWords,
 //       autoCorrect: user.autoCorrect
    }); 

    const [optionValue, setOptionValue] = useState<number[]>([user.actLengthWords]);

//     const viewOptionDb1 = async() => {
//         try {
//           const response = await fetch('/api/view_words', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             }
//           );
//           if (response.status === 200) {
//             const responseOpt = await response.json();
//             const wordLengths = responseOpt.map((i : { wordLength: number }) => i.wordLength);
// //            console.log(wordLengths);
//             setOptionValue(wordLengths);
//           } else {
//             // vratit do formulare a vypsat chybu ... 
//             const responseOpt = await response.text();
//             console.log(responseOpt);
//           }
//         } catch (ex) {
//           console.log("Chyba pri cteni view options: " + ex);
//         }    
//     }

    useEffect (() => {
//        viewOptionDb1();
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

    const onChangeOptionsLength = (e: React.ChangeEvent<HTMLSelectElement>) => {
//        console.log('Vybrano: ' +  parseInt(e.target.value));
        setSettings(oldSett => ({
            ...oldSett, 
            actLengthWords: parseInt(e.target.value)
        }));
    };

    const onChangeOptionsAutoFill = (e: React.ChangeEvent<HTMLInputElement>) => {
//        console.log('Vybrano: ' + (e.target.value==='true'));
        setSettings(oldSett => ({
            ...oldSett, 
            autoFill: e.target.value === 'true'
        }));
    };

/*    const onChangeOptionsAutoCorrect = (e: React.ChangeEvent<HTMLInputElement>) => {
      //        console.log('Vybrano: ' + (e.target.value==='true'));
              setSettings(oldSett => ({
                  ...oldSett, 
                  autoCorrect: e.target.value === 'true'
              }));
    };
*/
    const onSubmitSettingsOnDb = async( ud: UserSettings ) => {
//      setShowSettings(false);
      try {
        const response = await fetch('/api/set_uzivatel', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: ud.id,
            lengthWords: ud.actLengthWords,
            autoFill: ud.autoFill,
//            autoCorrect: ud.autoCorrect
          }),
        });
  
        if (response.status === 200) {
  //        set( oldSet => {...oldSet, actLengthWords: settingsRes.actLengthWords, autoFill: settingsRes.autoFill} );
        // proslo to ... nastavime, co jsme posilali do db
//          const kolik: number = ud.actLengthWords;
//          setLetterCount(kolik);
//          setChangeLength(true);
//          setLogin(ud);
          handleSubmit(ud, true, '');
        } else {
          // vratit do formulare a vypsat chybu ... 
          const settingsRes = await response.text();
//          setErrorText(settingsRes);
          handleSubmit(ud, false, settingsRes);
        }
      } catch (ex) {
        console.log("Chyba pri odesilani nastaveni .. " + ex);
      }    
  
    }
  
    const onSubmitSettings = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmitSettingsOnDb(settings);
//        handleSubmit(settings);
    }

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <div className="login-content">
              <div className="login-title">{t('settings.title')}</div>  
                <form onSubmit={onSubmitSettings}>
                  <div className="form-group">
                    <label>
                        {t('settings.wordLength')}
                        <select 
                            defaultValue={settings.actLengthWords}
                            onChange={onChangeOptionsLength} > 
                            {optionValue.map(o => 
                              <option key={o} value={o}>
                                  {o}
                              </option>
                             )
                            }
                        </select>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>{t('settings.autofill')}</label>
                    <label>
                        <input 
                            type="radio" 
                            name="autofill"
                            value="true"
                            checked={settings.autoFill}
                            onChange={onChangeOptionsAutoFill} /> 
                            {t('settings.yes')}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="autofill"
                            value="false"
                            checked={!settings.autoFill}
                            onChange={onChangeOptionsAutoFill} /> 
                            {t('settings.no')}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>{t('settings.language')}</label>
                    <button 
                        type="button" 
                        className={i18n.language === 'cs' ? 'button-ok active' : 'button-ok'} 
                        onClick={() => changeLanguage('cs')}>
                        CZ
                    </button>
                    <button 
                        type="button" 
                        className={i18n.language === 'sk' ? 'button-ok active' : 'button-ok'} 
                        onClick={() => changeLanguage('sk')}>
                        SK
                    </button>
                    <button 
                        type="button" 
                        className={i18n.language.startsWith('en') ? 'button-ok active' : 'button-ok'} 
                        onClick={() => changeLanguage('en')}>
                        EN
                    </button>
                    <button 
                        type="button" 
                        className={i18n.language === 'de' ? 'button-ok active' : 'button-ok'} 
                        onClick={() => changeLanguage('de')}>
                        DE
                    </button>
                    <button 
                        type="button" 
                        className={i18n.language === 'fr' ? 'button-ok active' : 'button-ok'} 
                        onClick={() => changeLanguage('fr')}>
                        FR
                    </button>
                    <button 
                        type="button" 
                        className={i18n.language === 'es' ? 'button-ok active' : 'button-ok'} 
                        onClick={() => changeLanguage('es')}>
                        ES
                    </button>
                    <button 
                        type="button" 
                        className={i18n.language === 'pl' ? 'button-ok active' : 'button-ok'} 
                        onClick={() => changeLanguage('pl')}>
                        PL
                    </button>
                  </div>
                  <div>
                    <button type='submit' className="button-ok">{t('settings.ok')}</button> 
                    <button type='button' className="button-ok" onClick={cancelSettings}>{t('settings.cancel')}</button> 
                  </div>
                </form>    
            </div>        
        </>
    );
}

export default GameSettings;