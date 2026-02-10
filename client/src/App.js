import React, { useState, useEffect } from 'react';

import { Router } from '@reach/router';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Delete from './views/Delete';
import Detail from './views/Detail';
import Login from './views/Login';
import Main from './views/Main';
import NotFound from './views/NotFound'
import Register from './views/Register';
import Search from './views/Search';
import Update from './views/Update';



// React client routing setup
function App() {

    // API base URL: use NODE_ENV (set to 'production' by CRA at build time) so production build uses REACT_APP_API_ROOT
    const envUrl = process.env.NODE_ENV === 'production'
        ? (process.env.REACT_APP_API_ROOT || (typeof window !== 'undefined' ? window.location.origin : ''))
        : 'http://localhost:8000';

    // state variable to hold logged in User
    const [logged, setLogged] = useState(
        JSON.parse(sessionStorage.getItem('logged'))
    );

    // state variables to be passed by each view to the NavBar to force rerender of audio player and syllables when redirecting to Search.js
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [syllables, setSyllables] = useState("");

    // hook to update logged User in sessionStorage when the state changes
    useEffect(() => {
        sessionStorage.setItem('logged', JSON.stringify(logged));
    }, [logged]);


    // returns the app with routes
    return (
        <div className="App">
            <Router>
                <NotFound default />
                <Main
                    envUrl={envUrl}
                    path="/"
                    logged={logged}
                    setLogged={setLogged}
                    setAudioLoaded={setAudioLoaded}
                    setSyllables={setSyllables}
                />
                <Search
                    envUrl={envUrl}
                    path="/search/:query"
                    logged={logged}
                    setLogged={setLogged}
                    audioLoaded={audioLoaded}
                    setAudioLoaded={setAudioLoaded}
                    syllables={syllables}
                    setSyllables={setSyllables}
                />
                <Register
                    envUrl={envUrl}
                    path="register/"
                    logged={logged}
                    setLogged={setLogged}
                    setAudioLoaded={setAudioLoaded}
                    setSyllables={setSyllables}
                />
                <Login
                    envUrl={envUrl}
                    path="login/"
                    logged={logged}
                    setLogged={setLogged}
                    setAudioLoaded={setAudioLoaded}
                    setSyllables={setSyllables}
                />
                <Detail
                    envUrl={envUrl}
                    path="user/account"
                    logged={logged}
                    setLogged={setLogged}
                    setAudioLoaded={setAudioLoaded}
                    setSyllables={setSyllables}
                />
                <Update
                    envUrl={envUrl}
                    path="user/account/edit"
                    logged={logged}
                    setLogged={setLogged}
                    setAudioLoaded={setAudioLoaded}
                    setSyllables={setSyllables}
                />
                <Delete
                    envUrl={envUrl}
                    path="user/account/delete"
                    logged={logged}
                    setLogged={setLogged}
                    setAudioLoaded={setAudioLoaded}
                    setSyllables={setSyllables}
                />
            </Router>
        </div>
    );
}


export default App;