import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from '@reach/router';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';



// defines style rulesets for Material UI components
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));


// WotdArchive retrieves the archive of all previous WOTDs
const WotdArchive = props => {

    // retrieves state variables from props
    const {envUrl} = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of words
    const [words, setWords] = useState([]);
    const [loaded, setLoaded] = useState(false);


    // retrieves the WOTD archive
    useEffect(() => {
        let cancelled = false;
        axios.get(`${envUrl}/api/wotd/archive`)
            .then(res => {
                if (cancelled) return;
                setWords(res.data.Archive ?? []);
                setLoaded(true);
            })
            .catch(() => {
                if (cancelled) return;
                setWords([]);
                setLoaded(true);
            });
        return () => { cancelled = true; };
    }, [envUrl]);


    // returns a material UI accordion component displaying the WOTD archive
    return (
        <div className={classes.root}>
            <Accordion className="rIWotdAccordion">
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>
                        <strong>
                            <i>
                                Recent words...
                            </i>
                        </strong>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.root}>
                        {loaded && (
                            <>
                                <ul className="inlineList">
                                    {words?.map((word, index) => (
                                        <li key={index} className="mgInlineBlock">
                                            <Typography>
                                                &nbsp;
                                                <Link to={"/search/" + words[index].word}>
                                                    <i>
                                                        <span className="rIPurple">
                                                            {word.word}
                                                        </span>
                                                    </i>
                                                </Link>
                                                {(words.indexOf(word) !== (words.length - 1)) && (
                                                    <strong>
                                                        <span className="rIOrange">
                                                            &ensp;|&nbsp;
                                                        </span>
                                                    </strong>
                                                )}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div >
    );
}


export default WotdArchive;