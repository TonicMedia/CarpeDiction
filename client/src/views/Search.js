import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { navigate } from '@reach/router';

import Comments from '../components/search/Comments';
// disabled for now due to 429 error...retry in a month or so maybe a bad useEffect ran up the limit...
// import DeepTrans from '../components/Results/DeepTrans';
import LinguaConj from '../components/search/LinguaConj';
import MwDictRes from '../components/search/MwDictRes';
import MwThesRes from '../components/search/MwThesRes';
import NavBar from '../components/common/NavBar';
import StickyFooter from '../components/common/StickyFooter';
import UrbanDict from '../components/search/UrbanDict';
import WordsApiRhymes from '../components/search/WordsApiRhymes';
import WordsApiFreq from '../components/search/WordsApiFreq';
import WordAssocRes from '../components/search/WordAssocRes';
import QueryRedirects from '../components/search/QueryRedirects';
import ResultsHeading from '../components/search/ResultsHeading';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';



// defines style rulesets for Material UI components
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '100',
        minHeight: '100vh',
    },
    divider: {
        margin: "30px 0",
    },
}));


// Search view returns search results
const Search = props => {

    // retrieves state variables from props
    const { envUrl,
        logged,
        setLogged,
        query,
        audioLoaded,
        setAudioLoaded,
        syllables,
        setSyllables } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of various query data
    const [isOffensive, setIsOffensive] = useState(0);
    const [notOffensive, setNotOffensive] = useState(0);
    const [pronunciations, setPronunciations] = useState([]);
    const [mp3s, setMp3s] = useState({});
    const [wavs, setWavs] = useState({});
    const [headWords, setHeadWords] = useState([]);
    const [spellings, setSpellings] = useState([]);
    const [loaded, setLoaded] = useState(true);

    const encQuery = query.toLowerCase();
    const decQuery = query.replace(/%2F/g, '/').replace(/%2f/g, '/').toLowerCase();

    // retrieves the query syllables results and processes them
    useEffect(() => {
        // sets the options for the request through Rapid API
        const options = {
            method: 'GET',
            url: `https://wordsapiv1.p.rapidapi.com/words/${encQuery}/syllables`,
            headers: {
                'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
                'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
            }
        };

        // makes the request
        axios.request(options)
            .then(res => {
                let entry = res.data;
                let resSyllables = "";
                // retrieve syllable data
                if (entry?.syllables?.list.length > 0) {
                    for (let i = 0; i < entry.syllables.list.length; i++) {
                        if (i !== entry.syllables.list.length - 1 && res.data.syllables.list[i + 1] !== "") {
                            resSyllables += (res.data.syllables.list[i] + ' * ');
                        } else {
                            resSyllables += res.data.syllables.list[i];
                        }
                    }
                    //update pertinent state variables and reset audio to fix back/forward issue
                    setSyllables(resSyllables);
                    setAudioLoaded(false);
                    setAudioLoaded(true);
                } else {
                    //update pertinent state variables and reset audio to fix back/forward issue
                    setSyllables("");
                    setAudioLoaded(false);
                    setAudioLoaded(true);
                }
                setLoaded(true);
            })
            .catch(err => {
                setLoaded(false);
            });
    }, [query, encQuery, logged, setAudioLoaded])

    // updates the User's data with the new data
    const updateUser = newUser => {
        axios.put(`${envUrl}/api/users`, newUser, { withCredentials: true })
            .then(res => {
                setLogged(res.data.user);
            })
            .catch(err => {
                if (err.response.status === 401)
                    navigate('/login');
            });
    };

    // toggles favorite status on query
    const handleFavs = () => {
        if (!logged.favs.includes(encQuery)) {
            logged.favs.push(encQuery);
        } else {
            const index = logged.favs.indexOf(encQuery);
            logged.favs.splice(index, index + 1);
        }
        // favorite the word
        updateUser(logged);
    }

    // returns the homepage
    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavBar
                envUrl={envUrl}
                logged={logged}
                setLogged={setLogged}
                setAudioLoaded={setAudioLoaded}
                setSyllables={setSyllables}
            />
            <div className="chocolate">
                <div className="filling">
                    <div className={classes.paper}>
                        <ResultsHeading
                            logged={logged}
                            handleFavs={handleFavs}
                            headWords={headWords}
                            spellings={spellings}
                            pronunciations={pronunciations}
                            syllables={syllables}
                            audioLoaded={audioLoaded}
                            loaded={loaded}
                            mp3s={mp3s}
                            wavs={wavs}
                            isOffensive={isOffensive}
                            notOffensive={notOffensive}
                            encQuery={encQuery}
                            decQuery={decQuery}
                            query={query}
                        />
                        <MwDictRes
                            query={decQuery}
                            setIsOffensive={setIsOffensive}
                            setNotOffensive={setNotOffensive}
                            setPronunciations={setPronunciations}
                            mp3s={mp3s}
                            setMp3s={setMp3s}
                            wavs={wavs}
                            setWavs={setWavs}
                            audioLoaded={audioLoaded}
                            setAudioLoaded={setAudioLoaded}
                            setHeadWords={setHeadWords}
                            setSpellings={setSpellings}
                        />
                        <MwThesRes query={decQuery} />
                        <UrbanDict query={decQuery} />
                        <WordsApiRhymes query={decQuery} />
                        <LinguaConj query={decQuery} />
                        {/* <DeepTrans query={query} /> */}
                        <WordsApiFreq query={decQuery} />
                        <WordAssocRes query={decQuery} />
                        <br />
                        <QueryRedirects encQuery={encQuery} />
                        <Comments
                            envUrl={envUrl}
                            query={decQuery}
                            logged={logged}
                        />
                    </div>
                </div>
            </div>
            <StickyFooter />
        </div>
    );
};


export default Search;