import React, { useEffect } from 'react';

const carpe_diction = process.env.PUBLIC_URL + '/images/carpe_diction.png';

import FoundersNote from '../components/main/FoundersNote';
import Links from '../components/main/Links';
import NavBar from '../components/common/NavBar';
import StickyFooter from '../components/common/StickyFooter';
import TipJars from '../components/main/TipJars';
import WotdCard from '../components/main/WotdCard';

import CssBaseline from '@material-ui/core/CssBaseline';
import { Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';



// defines style rulesets for Material UI components
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    paper: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    divider: {
        margin: "30px 0",
    },
}));


// Main view is the homepage
const Main = props => {

    // retrieves state variables from props
    const { envUrl,
        logged,
        setLogged,
        setAudioLoaded,
        setSyllables } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // alert user of any current site issues
    useEffect(() => {
        if (logged === null)
            alert("* NOTICE: 12/09/2022\nThe website's backend is currently down, leaving account features and other site features out of service for the time being.\nI am in the middle of a move, and will be addressing this issue ASAP!\nHappy holidays!");
    }, [logged])

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
                        <div className="resHeading">
                            <img
                                src={carpe_diction}
                                width="100%"
                                height=""
                                alt="CarpeDiction!"
                            />
                            <p className="cdTagLine">
                                <strong>
                                    <i>
                                        Language is art!
                                    </i>
                                    Query a word, phrase, suffix, prefix or colloquialism above to get started!
                                </strong>
                            </p>
                            <WotdCard envUrl={envUrl} />
                        </div>
                    </div>
                </div>
            </div>
            <StickyFooter />
        </div >
    );
};


export default Main;