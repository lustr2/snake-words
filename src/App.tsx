import { useEffect, useState } from 'react';
import Deskboard from './components/deskboard/Deskboard';
import Keyboard from './components/keyboard/Keyboard';
import { UserSettings, UserContext } from './components/context/SettingsContext';
import RegistrationPage from './components/loginpage/RegistrationPage';
import LoginPage from './components/loginpage/LoginPage';
import GameSettings from './components/gamesettings/GameSettings';

import './App.css'
import GameHistory from './components/gamehistory/GameHistory';
import RulesGame from './components/rulesgame/RulesGame';
import StatisticsGame from './components/statisticsgame/StatisticsGame';
import AppHeader from './components/header/AppHeader';
import AppFooter from './components/footer/AppFooter';
import { useGameLogic } from './hooks/useGameLogic';


function App() {
  /** Menu */
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<boolean>(false);
  const [rulesGame, setRulesGame] = useState<boolean>(false);
  const [statisticsGame, setStatisticsGame] = useState<boolean>(false);

  /** Registration/Login section */
  const [loginNow, setLoginNow] = useState<boolean>(false);
  const [login, setLogin] = useState<UserSettings>({ id: 0, userName: '', actLengthWords: 5, autoFill: false });
  const [registrationNew, setRegistrationNew] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  const game = useGameLogic(login);

  /** Ukladani do Local Stored */
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    setItems(game.sign.word);
  }, [game.sign.word]);

  const loginButton = () => {
    setRulesGame(false);
    if (login.userName === '') {
      setLoginNow(true);
    } else {
      setLoginNow(false);
    }
  }

  const registrationButton = () => {
    setAuthError('');
    setViewHistory(false);
    setLoginNow(false);
    setRegistrationNew(old => !old);
  }

  const logoutButton = () => {
    setLoginNow(false);
    setRegistrationNew(false);
    game.setLetterCount(0);
    setLogin({ id: 0, userName: '', actLengthWords: 0, autoFill: false });
    
    game.resetGameState('');

    setShowSettings(false);
    game.setSlovaZDB({ idSlov: [], slova: [], userPlayed: [] });
    game.setPointerSlova(-1);
    game.setContinuePlay(false);
    game.setHistory([]);
    game.setContinueAW(-1);
    game.setContinueShots([]);
  }

  const handleClickRegistration = (rd: UserSettings, errText: string) => {
    setAuthError(errText);
    setViewHistory(false);
    setLoginNow(false);
    setRegistrationNew(false);
    if (errText === '') {
      setLogin(rd);
      game.setLetterCount(rd.actLengthWords);
    }
  }

  const handleClickLogin = (ld: UserSettings, errText: string) => {
    setAuthError(errText);
    setViewHistory(false);
    setLoginNow(false);
    if (errText === '') {
      setLogin(ld);
      game.setLetterCount(ld.actLengthWords);
    }
  }

  const handleSettingsClick = () => {
    setViewHistory(false);
    setRulesGame(false);
    setShowSettings(true);
    game.setActiveWord('');
    game.setErrorText('');
    setStatisticsGame(false);
  };

  const handleSubmitSettings = (us: UserSettings, changeLen: boolean, errText: string) => {
    setShowSettings(false);
    setViewHistory(false);
    setRulesGame(false);
    game.setLetterCount(us.actLengthWords);
    game.setChangeLength(changeLen);
    setLogin(us);
    game.setErrorText(errText);
    setStatisticsGame(false);
  }

  const handleSettingsCancel = () => {
    setShowSettings(false);
    setViewHistory(false);
  }

  const handleHistoryClick = () => {
    setShowSettings(false);
    setRulesGame(false);
    setViewHistory(true);
    game.resetGameState('');
    game.setContinueAW(-1);
    game.setContinueShots([]);
  }

  const handleRulesGame = () => {
    setRulesGame(!rulesGame);
    setViewHistory(false);
    setShowSettings(false);
    game.setActiveWord('');
    setStatisticsGame(false);
  }

  const handleStatisticsClick = () => {
    setRulesGame(false);
    setViewHistory(false);
    setStatisticsGame(!statisticsGame);
    setShowSettings(false);
    game.setActiveWord('');
  }

  return (
    <>
      <UserContext.Provider value={{ ...login }}>
        <div className="app-container">
          <AppHeader
            login={login}
            loginNow={loginNow}
            registrationNew={registrationNew}
            activeWord={game.activeWord}
            finish={game.finish}
            hasWords={game.slovaZDB.slova.length > 0}
            onSettingsClick={handleSettingsClick}
            onStatisticsClick={handleStatisticsClick}
            onHistoryClick={handleHistoryClick}
            onRulesClick={handleRulesGame}
            onLoginClick={loginButton}
            onRegistrationClick={registrationButton}
            onLogoutClick={logoutButton}
            onChoiceModelClick={game.choiceModel}
          />
          {(loginNow) &&
            <LoginPage onClickLogin={handleClickLogin} onClickRegistration={registrationButton} />
          }
          {(registrationNew) &&
            <RegistrationPage onClickRegistration={handleClickRegistration} />
          }
          {(game.activeWord.length > 0) &&
            <>
              <div >
                <Deskboard
                  sign={game.sign}
                  numberActiveInput={game.numberActiveInput}
                  model={game.activeWord}
                  continueShots={game.continuePlay &&
                    (game.history.findIndex(h => (h.model === game.activeWord)) !== -1)
                    ? game.history[game.history.findIndex(h => (h.model === game.activeWord))].history
                    : undefined
                  }
                  onChangeInputAuto={game.onChangeInputAuto}
                  onChangeInput={game.onChangeInput}
                  onSubmitWord={game.onSubmitWord}
                />
              </div>
              {(!game.finish) &&
                <div className="content">
                  <Keyboard
                    rightSign={game.rightLetter}
                    wrongSign={game.wrongLetter}
                    misplaceSign={game.misplaceLetter}
                    onChange={game.handleChangeSign}
                  />
                </div>
              }
            </>
          }
          {(showSettings) &&
            <GameSettings handleSubmit={handleSubmitSettings} cancelSettings={handleSettingsCancel} />
          }
          {((login.id > 0) && viewHistory) &&
            <GameHistory user={login} continueWord={game.handleClickContinue} />
          }
          {(rulesGame) &&
            <RulesGame onClickBack={handleRulesGame} />
          }
          {(statisticsGame) &&
            <StatisticsGame />
          }
          {game.errorText}
          {authError}
          <AppFooter />
        </div>
      </UserContext.Provider>
    </>
  )
}

export default App;
