import React, { useState, useEffect } from 'react';

import axios from 'axios';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Container from '@material-ui/core/Container';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { encodeSearchQuery } from '../../utils/searchUtils';
import { searchAccordionStyles } from './searchAccordionStyles';

const useStyles = makeStyles((theme) => searchAccordionStyles(theme));


// WordsApiFreq retrieves and displays frequency data results from Words API
const WordsApiFreq = props => {

    // retrieves search variables from props
    const { query } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of search progress and results
    const [entry, setEntry] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const controller = new AbortController();
        const options = {
            method: 'GET',
            url: `https://wordsapiv1.p.rapidapi.com/words/${encodeSearchQuery(query)}/frequency`,
            headers: {
                'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
                'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
            },
            signal: controller.signal,
        };
        axios.request(options)
            .then(res => {
                const resEntry = res.data;
                // updates all pertinent state variables
                if (!resEntry.frequency) {
                    setError(`No results from Words API...`);
                    setEntry(null);
                    setLoaded(false);
                } else {
                    setError(null);
                    setEntry(resEntry);
                    setLoaded(true);
                }
            })
            .catch((err) => {
                if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
                setError(`No results from Words API...`);
                setEntry(null);
                setLoaded(false);
            });
        return () => controller.abort();
    }, [query]);


    // returns a material UI accordion component displaying the frequency data
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
                                    {(entry && entry.frequency) && (
                                        Object.keys(entry.frequency).length
                                    )}
                                    {!(entry && entry.frequency) && (
                                        0
                                    )}
                                    )
                                    <span className="rIOrange">
                                        &nbsp;-&nbsp;
                                    </span>
                                    <i>
                                        <u>
                                            Frequency Data
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
                                {(entry && entry.frequency) && (
                                    <>
                                        {entry.word && (
                                            <>
                                                <Typography className="text-muted">
                                                    <strong>
                                                        &emsp;
                                                        Frequency data for :&ensp;
                                                        "
                                                        {entry.word.toLowerCase()}
                                                        "
                                                    </strong>
                                                </Typography>
                                                <br />
                                            </>
                                        )}
                                        {entry.frequency.zipf >= 0 && (
                                            <>
                                                <Typography>
                                                    <i>
                                                        <strong>
                                                            <span className="rIOrange">
                                                                &emsp;&emsp;~&nbsp;
                                                            </span>
                                                            <span className="cdTooltip text-muted">
                                                                Zipf Rating
                                                                <span className="cdTooltipText">
                                                                    <Link
                                                                        target="_blank"
                                                                        href="https://www.youtube.com/watch?v=fCn8zs912OE"
                                                                        className="flatLinkOrange"
                                                                        style={{ textDecoration: "none" }}
                                                                    >
                                                                        Click here to learn about the Zipf mystery!
                                                                    </Link>
                                                                </span>
                                                            </span>
                                                            <span className="rIPurple">
                                                                &ensp;:&nbsp;
                                                                {entry.frequency.zipf}
                                                            </span>
                                                        </strong>
                                                        <br />
                                                    </i>
                                                </Typography>
                                                <Container>
                                                    <Typography>
                                                        <i>
                                                            <span className="mgSmFont">
                                                                <span className="rIOrange">
                                                                    &emsp;&emsp;*&nbsp;
                                                                </span>
                                                                A score indicating how common the word is in the English language, with a range of 1 - 7;
                                                            </span>
                                                        </i>
                                                    </Typography>
                                                </Container>
                                                <br />
                                            </>
                                        )}
                                        {entry.frequency.perMillion >= 0 && (
                                            <>
                                                <Typography>
                                                    <i>
                                                        <strong>
                                                            <span className="rIOrange">
                                                                &emsp;&emsp;~
                                                            </span>
                                                            <span className="text-muted">
                                                                &nbsp;Per - Million Rating :
                                                            </span>
                                                            <span className="rIPurple">
                                                                &nbsp;
                                                                {entry.frequency.perMillion}
                                                            </span>
                                                        </strong>
                                                        <br />
                                                    </i>
                                                </Typography>
                                                <Container>
                                                    <Typography>
                                                        <i>
                                                            <span className="mgSmFont">
                                                                <span className="rIOrange">
                                                                    &emsp;&emsp;*&nbsp;
                                                                </span>
                                                                The number of times the word is likely to appear in a corpus of one million English words;
                                                            </span>
                                                        </i>
                                                    </Typography>
                                                </Container>
                                                <br />
                                            </>
                                        )}
                                        {entry.frequency.diversity >= 0 && (
                                            <>
                                                <Typography>
                                                    <i>
                                                        <strong>
                                                            <span className="rIOrange">
                                                                &emsp;&emsp;~
                                                            </span>
                                                            <span className="text-muted">
                                                                &nbsp;Diversity Rating :
                                                            </span>
                                                            <span className="rIPurple">
                                                                &nbsp;
                                                                {entry.frequency.diversity}
                                                            </span>
                                                        </strong>
                                                        <br />
                                                    </i>
                                                </Typography>
                                                <Container>
                                                    <Typography>
                                                        <i>
                                                            <span className="mgSmFont">
                                                                <span className="rIOrange">
                                                                    &emsp;&emsp;*&nbsp;
                                                                </span>
                                                                0 - 1 scale the shows the likelyhood of the word appearing in an English document that is part of a corpus;
                                                            </span>
                                                        </i>
                                                    </Typography>
                                                </Container>
                                                <br />
                                            </>
                                        )}
                                    </>
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


export default WordsApiFreq;