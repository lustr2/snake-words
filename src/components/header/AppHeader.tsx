import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserSettings } from '../context/SettingsContext';

interface AppHeaderProps {
    login: UserSettings;
    loginNow: boolean;
    registrationNew: boolean;
    activeWord: string;
    finish: boolean;
    hasWords: boolean;
    onSettingsClick: () => void;
    onStatisticsClick: () => void;
    onHistoryClick: () => void;
    onRulesClick: () => void;
    onLoginClick: () => void;
    onRegistrationClick: () => void;
    onLogoutClick: () => void;
    onChoiceModelClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    login,
    loginNow,
    registrationNew,
    activeWord,
    finish,
    hasWords,
    onSettingsClick,
    onStatisticsClick,
    onHistoryClick,
    onRulesClick,
    onLoginClick,
    onRegistrationClick,
    onLogoutClick,
    onChoiceModelClick
}) => {
    const { t } = useTranslation();

    return (
        <div className="header">
            <div className="title-bar">{t('app.title')}</div>
            <div className="menu-bar">
                <div className="menu-button">&#9776;
                    <div className="dropdown-content">
                        {((login.id !== 0) && ((activeWord.length === 0) || (finish))) &&
                            <>
                                <a href="#" onClick={(e) => { e.preventDefault(); onSettingsClick(); }}>{t('menu.settings')}</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onStatisticsClick(); }}>{t('menu.statistics')}</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onHistoryClick(); }}>{t('menu.history')}</a>
                            </>
                        }
                        <a href="#" onClick={(e) => { e.preventDefault(); onRulesClick(); }}>{t('menu.rules')}</a>
                    </div>
                </div>
                {((!loginNow) && (!registrationNew) && (login.id === 0)) &&
                    <button
                        className='login'
                        onClick={onLoginClick}>
                        {t('menu.login')}
                    </button>
                }
                {((registrationNew) && (loginNow)) &&
                    <button
                        className='login'
                        onClick={onRegistrationClick}>
                        {t('menu.registration')}
                    </button>
                }
                {(login.id !== 0) &&
                    <> {login.userName}
                        <button
                            className='logout'
                            onClick={onLogoutClick}>
                            {t('menu.logout')}
                        </button>
                    </>
                }
                {((login.id !== 0) && hasWords) &&
                    <button
                        className={finish ? "new-game" : "cancel-game"}
                        onClick={onChoiceModelClick}>
                        {finish ? t('menu.newGame') : t('menu.cancel')}
                    </button>
                }
            </div>
        </div>
    );
};

export default AppHeader;
