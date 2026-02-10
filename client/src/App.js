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

    // API base URL: production uses REACT_APP_API_ROOT or same origin. Avoid mixed content: if page is HTTPS, use HTTPS for API.
    const envUrl = (() => {
        if (process.env.NODE_ENV !== 'production') return 'http://localhost:8000';
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const configured = process.env.REACT_APP_API_ROOT || origin;
        // If page is HTTPS but configured URL is HTTP, use same origin (fixes mixed content when env var is wrong)
        if (typeof window !== 'undefined' && window.location.protocol === 'https:' && configured.startsWith('http:')) {
            return origin;
        }
        return configured || origin;
    })();

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