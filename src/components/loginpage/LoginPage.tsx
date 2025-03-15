import React, { useState } from "react";
import { UserSettings } from "../context/SettingsContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import './style.css';

interface LoginDataI {
    onClickLogin: (ld: UserSettings, errText: string) => void;
    onClickRegistration: () => void;
}

const LoginPage: React.FC<LoginDataI> = ({ onClickLogin, onClickRegistration  }) => {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const loginOnDb = async( uN: string, pass: string ) => {
        try {
            const response = await fetch(`/api/login/${uN}/${pass}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const loginRes = await response.json();
                console.log(loginRes);
                onClickLogin({ id: loginRes.id , userName: loginRes.userName, actLengthWords: loginRes.lengthWords, autoFill: loginRes.autoFill} , '');
        //        setLogin( {id: loginRes.id , userName: loginRes.userName, actLengthWords: loginRes.lengthWords, autoFill: loginRes.autoFill} );
        //        setLetterCount(loginRes.lengthWords); 
        //        console.log('Nastavujeme letterCount na ' +  loginRes.lengthWords);
            } else {
                // vratit do formulare a vypsat chybu ... 
                const loginResError = await response.text();
                onClickLogin({ id:0, userName: '', actLengthWords: 0, autoFill: false }, loginResError);
//            setLogin({id:0, userName: '', actLengthWords: 0, autoFill: false});
//            setErrorText(loginResError);
            }
        } catch (ex) {
            console.log("Chyba pri login" + ex);
        }    
    }

    const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
//        onClickLogin({userName, password});
        loginOnDb(userName, password);
    }

    const handleClickRegistration = () => {
        onClickRegistration(); 
    }


/*    const loadGoogleScript = () => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    };
    
    useEffect(() => {
        loadGoogleScript();
        console.log(window.google ? "Google SDK načteno" : "Google SDK není dostupné");

        window.google.accounts.id.initialize({
            client_id: "668638785546-0hg5d3sm3gp7fpcn3nnbocdmatr9milp.apps.googleusercontent.com",
            callback: (response) => {
                console.log("Google Token:", response.credential);
            }
        });
    }, []);

*/
    const handleGoogleLogin = async (credentialResponse : any) => {
        
        try {
            const response = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: credentialResponse.clientId,
                    credential: credentialResponse.credential,
                    select_by: credentialResponse.select_by
                })
            });
    
            const data = await response.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.id);
                // Přesměrování nebo další akce po přihlášení
                console.log('token: ' + data.token);
                console.log('ID: ' + data.id);
            }
            console.log(response.status);
            if ((response.status === 201) || (response.status === 200)) {
                const loginRes = data;
                onClickLogin({ id: loginRes.id , userName: loginRes.userName, actLengthWords: loginRes.lengthWords, autoFill: loginRes.autoFill} , '');
            } else {
                const loginResError = await response.text();
                onClickLogin({ id:0, userName: '', actLengthWords: 0, autoFill: false }, loginResError);  
            }
        } catch (error) {
            console.error("Google login error:", error);
        }

    };

    
    return (
        <>
            <div className="login-content">
              <div className="body-title">Login</div>  
                <form onSubmit={onSubmitLogin}>
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
                  <div className="body-title">
                    <button type='submit' className="button-ok">Ok</button> 
                    <button type='button' className="button-register" onClick={handleClickRegistration}>Registration</button> 
                  </div>
                </form>
                {/* Google Přihlášení */}
                <div className="google-login">
                        <GoogleOAuthProvider clientId="668638785546-0hg5d3sm3gp7fpcn3nnbocdmatr9milp.apps.googleusercontent.com">
                        <GoogleLogin
                            theme="filled_black"
                            onSuccess={credentialResponse => {
                                handleGoogleLogin(credentialResponse);
                            }}
                            onError={() => {
                                console.log("Login Failed");
                            }}
                        />
                        </GoogleOAuthProvider>
                    </div>
            </div>
        </>
    );
};

export default LoginPage;