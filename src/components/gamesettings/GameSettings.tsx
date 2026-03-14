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

    useEffect (() => {
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
        setSettings(oldSett => ({
            ...oldSett, 
            actLengthWords: parseInt(e.target.value)
        }));
    };

    const onChangeOptionsAutoFill = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(oldSett => ({
            ...oldSett, 
            autoFill: e.target.value === 'true'
        }));
    };

    const onSubmitSettingsOnDb = async( ud: UserSettings ) => {
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
          }),
        });
  
        if (response.status === 200) {
          handleSubmit(ud, true, '');
        } else {
          const settingsRes = await response.text();
          handleSubmit(ud, false, settingsRes);
        }
      } catch (ex) {
        console.log("Chyba pri odesilani nastaveni .. " + ex);
      }    
    }
  
    const onSubmitSettings = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmitSettingsOnDb(settings);
    }

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { code: 'cs', label: 'CZ' },
        { code: 'sk', label: 'SK' },
        { code: 'en', label: 'EN' },
        { code: 'de', label: 'DE' },
        { code: 'fr', label: 'FR' },
        { code: 'es', label: 'ES' },
        { code: 'pl', label: 'PL' }
    ];

    const currentLang = (i18n.language || 'en').split('-')[0];

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
                    {languages.map((lang) => (
                        <button 
                            key={lang.code}
                            type="button" 
                            className={currentLang === lang.code ? 'button-lang active' : 'button-lang'} 
                            onClick={() => changeLanguage(lang.code)}>
                            {lang.label}
                        </button>
                    ))}
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
