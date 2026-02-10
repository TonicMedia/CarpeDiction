import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from '@reach/router';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { encodeSearchQuery } from '../../utils/searchUtils';
import { searchAccordionStyles } from './searchAccordionStyles';

const useStyles = makeStyles((theme) => searchAccordionStyles(theme));


// WordsApiRhymes retrieves and displays rhyme results for the qury from Words API
const WordsApiRhymes = props => {

    // retrieves search variables from props
    const { query } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of search progress and results
    const [entry, setEntry] = useState([]);
    const [words, setWords] = useState([]);
    const [phrases, setPhrases] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const controller = new AbortController();
        const options = {
            method: 'GET',
            url: `https://wordsapiv1.p.rapidapi.com/words/${encodeSearchQuery(query)}/rhymes`,
            headers: {
                'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
                'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
            },
            signal: controller.signal,
        };
        axios.request(options)
            .then(res => {
                const resEntry = res.data;
                // generates an array of the rhymes found by the search
                const resWords = [];
                const resPhrases = [];
                if (res.data.rhymes.all && res.data.rhymes.all.length !== 0) {
                    for (const resWord of res.data.rhymes.all) {
                        if (resWord.split(" ").length > 1) {
                            resPhrases.push(resWord);
                        } else if (resWord.split("-").length > 1) {
                            resPhrases.push(resWord);
                        } else {
                            resWords.push(resWord);
                        }
                    }

                    // fix 'resPhrases' falling out of alphabetization
                    resPhrases.sort(function(a, b) {
                        return a.localeCompare(b);
                    });
                }

                // updates all pertinent state variables
                if (Object.keys(res.data.rhymes).length === 0) {
                    setError(`No results from Words API...`);
                    setWords(null);
                    setLoaded(false);
                } else {
                    setError(null);
                    setEntry(resEntry);
                    setWords(resWords);
                    setPhrases(resPhrases);
                    setLoaded(true);
                }
            })
            .catch((err) => {
                if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
                setError(`No results from Words API...`);
                setWords(null);
                setLoaded(false);
            });
        return () => controller.abort();
    }, [query]);


    // returns a material UI accordion component displaying the rhymes retrieved
    return (
        <div className={classes.root}>
            <Accordion className="rIAccordion">
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid
                            item
                            xs={6}
                        >
                            <Typography className={classes.heading}>
                                <strong>
                                (
                                    {(words?.length > 0) && (
                                        words.length
                                    )}
                                    {!words && (
                                        0
                                    )}
                                    )
                                    <span className="rIOrange">
                                        &nbsp;-&nbsp;
                                    </span>
                                    <i>
                                        <u>
                                            Rhymes
                                        </u>
                                    </i>
                                </strong>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            className="mgTxtRight"
                        >
                            <Typography className={classes.heading}>
                                <strong className="mgSmFont">
                                    <i>
                                        <span className="rIOrange">
                                            ...&nbsp;from&nbsp;
                                        </span>
                                        <span className="rIPurple">
                                            Words API
                                        </span>
                                    </i>
                                </strong>
                            </Typography>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.root}>
                        {loaded && (
                            <>
                                <ul className="inlineList">
                                    <li className="mgInlineBlock text-muted">
                                        <Typography>
                                            <strong>
                                                &emsp;Words that rhyme with
                                                "
                                                {entry?.word?.toLowerCase()}
                                                " ~ (A-Z) :&nbsp;
                                            </strong>
                                        </Typography>
                                    </li>
                                    {words?.map((word, index) => (
                                        <li key={index} className="mgInlineBlock">
                                            <Typography>
                                                &ensp;
                                                <Link to={`/search/${entry?.rhymes?.all[index]}`}>
                                                    <i>
                                                        <span className="rIPurple">
                                                            {word}
                                                        </span>
                                                    </i>
                                                </Link>
                                                {(words?.indexOf(word) !== (words?.length - 1)) && (
                                                    <strong>
                                                        <span className="rIOrange">
                                                            &ensp;|
                                                        </span>
                                                    </strong>
                                                )}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="inlineList">
                                    <li className="mgInlineBlock text-muted">
                                        <Typography>
                                            <strong>
                                                &emsp;Phrases that rhyme with
                                                "
                                                {entry?.word?.toLowerCase()}
                                                " ~ (A-Z) :&nbsp;
                                            </strong>
                                        </Typography>
                                    </li>
                                    {phrases?.map((phrase, index) => (
                                        <li key={index} className="mgInlineBlock">
                                            <Typography>
                                                &nbsp;
                                                <Link to={`/search/${phrases[index]}`}>
                                                    <i>
                                                        <span className="rIPurple">
                                                            {phrase}
                                                        </span>
                                                    </i>
                                                </Link>
                                                {(phrases?.indexOf(phrase) !== (phrases?.length - 1)) && (
                                                    <strong>
                                                        <span className="rIOrange">
                                                            &nbsp;|&nbsp;
                                                        </span>
                                                    </strong>
                                                )}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {!loaded && (
                            <Typography className="text-danger mgWordBreak">
                                <strong>
                                    <i>
                                        &emsp;
                                        {error}
                                    </i>
                                </strong>
                            </Typography>
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}


export default WordsApiRhymes;