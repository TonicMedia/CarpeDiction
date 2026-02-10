import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from '@reach/router';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { encodeSearchQuery } from '../../utils/searchUtils';
import { searchAccordionStyles } from './searchAccordionStyles';

const useStyles = makeStyles((theme) => searchAccordionStyles(theme));


// WordAssocRes retrieves and displays a list of related words from Word Associations API 
const WordAssocRes = props => {

    // retrieves search variables from props
    const { query } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of search progress and results
    const [entry, setEntry] = useState([]);
    const [words, setWords] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const controller = new AbortController();
        const options = {
            method: 'GET',
            url: 'https://twinword-word-associations-v1.p.rapidapi.com/associations/',
            params: { entry: encodeSearchQuery(query) },
            headers: {
                'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
                'x-rapidapi-host': 'twinword-word-associations-v1.p.rapidapi.com'
            },
            signal: controller.signal,
        };
        axios.request(options)
            .then(res => {
                const resEntry = res.data;
                // generates an array of the word found by the search
                const resWords = [];
                for (const resWord in resEntry.associations_scored) {
                    const percentage = (resEntry.associations_scored[resWord] * 100).toFixed(2)
                    resWords.push(`${resWord} : ${percentage}%`)
                }

                // updates all pertinent state variables
                if (resEntry.result_code === "462") {
                    setError(`No results from Word Associations API...`);
                    setEntry(null);
                    setWords(null);
                    setLoaded(false);
                } else if (resWords.length === 0) {
                    setError(`No results from Word Associations API...`);
                    setEntry(null);
                    setWords(null);
                    setLoaded(false);
                } else {
                    setError(null);
                    setEntry(resEntry);
                    setWords(resWords);
                    setLoaded(true);
                }
            })
            .catch((err) => {
                if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
                if (err?.response?.status === 503) {
                    setError(`Word Associations API is temporarily unavailable...`);
                } else {
                    setError(`No results from Word Associations API...`);
                }
                setEntry(null);
                setWords(null);
                setLoaded(false);
            });
        return () => controller.abort();
    }, [query]);


    // returns a material UI accordion component displaying the results from Word Associations API
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
                                            Related Words
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
                                            Word Associations API
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
                                {(words?.length > 0 && entry?.associations_scored) && (
                                    <ul className="inlineList">
                                        <li className="mgInlineBlock text-muted">
                                            <Typography>
                                                <strong>
                                                    &emsp;Related words / similarity score for "
                                                    <span className="mgWordBreak">
                                                        {query}
                                                    </span>
                                                    " :&nbsp;
                                                </strong>
                                            </Typography>
                                        </li>
                                        {words?.map((word, index) => (
                                            <li key={index} className="mgInlineBlock">
                                                <Typography>
                                                    &ensp;
                                                    <Link to={`/search/${Object?.keys(entry?.associations_scored)[index]}`}>
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
                                )}
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


export default WordAssocRes;