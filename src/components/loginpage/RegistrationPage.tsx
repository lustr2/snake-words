import React, { useState } from "react";
import { UserSettings } from "../context/SettingsContext";

interface RegistrationDataI {
    onClickRegistration: (ld: UserSettings, errText: string) => void;
}

const LoginPage: React.FC<RegistrationDataI> = ({ onClickRegistration }) => {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const registrationOnDb = async( uN: string, pass: string, email: string ) => {

      try {
        const response = await fetch('/api/uzivatel', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: uN,
            password : pass,
            email: email,
          }),
        });
  
        if ((response.status >= 200) && (response.status <= 202)) {
          const registrationRes = await response.json();
          onClickRegistration({id: registrationRes.id , userName: registrationRes.userName, actLengthWords: 5, autoFill: false}, '');
//          setLogin( {id: registrationRes.id , userName: registrationRes.userName, actLengthWords: 5, autoFill: false} );
//          setLetterCount(5);
          console.log(registrationRes);
        } else {
          // vratit do formulare a vypsat chybu ... 
          const registrationResError = await response.text();
          onClickRegistration({ id:0, userName: '', actLengthWords: 0, autoFill: false}, registrationResError);
//          setLogin({ id:0, userName: '', actLengthWords: 0, autoFill: false});
//          setErrorText(registrationResError);
        }
      } catch (ex) {
        console.log("Chyba pri odesilani registrace");
      }    
  
    }

    const onSubmitRegistration = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        registrationOnDb(userName, password, email);
//        onClickRegistration({userName, password, email});
    }
 
    return (
        <>
            <div className="login-content">
              <div className="body-title">Registration</div>  
                <form onSubmit={onSubmitRegistration} >
                  <div className="form-group">
                    <label className="label-text">User name:</label>
                    <input 
                        type="text" 
                        name='userName' 
                        onChange={(e) => setUserName(e.target.value)}
                        maxLength={30} 
                        placeholder="User name max 30" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="label-text">Password:</label>
                    <input 
                        type="password" 
                        name='password'
                        onChange={(e) => setPassword(e.target.value)} 
                        maxLength={30} 
                        placeholder="Password max 30" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="label-text">Email:</label>
                    <input 
                        type="email" 
                        name='email'
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={50} 
                        placeholder="Email max 50" 
                    />
                  </div>
                  <div className="body-title">
                    <button type='submit' className="button-ok">Ok</button> 
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginPage;