import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from '@reach/router';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { encodeSearchQuery } from '../../utils/searchUtils';
import { searchAccordionStyles } from './searchAccordionStyles';

const useStyles = makeStyles((theme) => searchAccordionStyles(theme));


// MWThesRes retrieves and displays query results from the Merriam-Webster Collegiate Thesaurus API
const MWThesRes = props => {

    // retrieves search variables from props
    const { query } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of search progress and results
    const [entries, setEntries] = useState([]);
    const [entriesByType, setEntriesByType] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const controller = new AbortController();
        const encQuery = encodeSearchQuery(query);
        axios.get(`https://dictionaryapi.com/api/v3/references/thesaurus/json/${encQuery}?key=${process.env.REACT_APP_MW_THES_KEY}`, { signal: controller.signal })
            .then(res => {
                // generates an array of the entries found by the search
                const resEntries = [];
                for (const entryKey of Object.keys(res.data)) {
                    if (res.data[entryKey].fl !== undefined)
                        resEntries.push(res.data[entryKey]);
                }

                // generates an object with key for each type of entry found and values containing arrays of entries matching the type
                const entryTypes = {};
                // local offensive counters to manipulate and push their sums to overall offensive score
                for (const entry of resEntries) {
                    // removes format bracket pairs and leftover references to other entries from example sentence data if present
                    if (entry.def && entry.def[0] && entry.def[0].sseq.length) {
                        for (const sseq of entry.def[0].sseq) {
                            if (entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)] && entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0] && entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0][1] && entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0][1].dt && entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0][1].dt[1] && entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0][1].dt[1][1] && entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0][1].dt[1][1][0] && entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0][1].dt[1][1][0].t)
                                entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0][1].dt[1][1][0].t = entry.def[0].sseq[entry.def[0].sseq.indexOf(sseq)][0][1].dt[1][1][0].t.replace(/\{.{1,5}\}/g, '');
                        }
                    }
                    // checks if the type of entry exists in the object and adds it to the appropriate array if so, and creates a new one if not
                    if (`${entry.fl}` in entryTypes) {
                        entryTypes[`${entry.fl}`].push(entry);
                        continue;
                    } else {
                        entryTypes[`${entry.fl}`] = [entry];
                    }
                }

                // updates all pertinent state variables
                if (resEntries.length === 0) {
                    setError(`No results from the Merriam-Webster Thesaurus...`);
                    setEntries(null);
                    setLoaded(false);
                } else {
                    setError(null);
                    setEntries(resEntries);
                    setEntriesByType(entryTypes);
                    setLoaded(true);
                }
            })
            .catch((err) => {
                if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
                setError(`No results from the Merriam-Webster Thesaurus...`);
                setEntries(null);
                setLoaded(false);
            });
        return () => controller.abort();
    }, [query]);


    // returns a material UI accordion component displaying the results from the MW Thesaurus API
    return (
        <div className={classes.root}>
            <Accordion className="rIAccordion">
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>
                        <strong>
                            (
                            {entries && (
                                entries.length
                            )}
                            {!entries && (
                                0
                            )}
                            )
                            <span className="rIOrange">
                                &nbsp;-&nbsp;
                            </span>
                            <i>
                                <u>
                                    Merriam-Webster Thesaurus
                                </u>
                            </i>
                        </strong>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.root}>
                        {loaded && (
                            <>
                                {Object.keys(entriesByType)?.map((type, index) => (
                                    <Accordion
                                        key={index}
                                        className="rIAccordion"
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className={classes.heading}>
                                                <strong>
                                                    (
                                                    {entriesByType[type].length}
                                                    )
                                                    <span className="rIOrange">
                                                        &nbsp;-&nbsp;
                                                    </span>
                                                    <i>
                                                        {type.replace(type[0], type[0].toUpperCase())}
                                                        &nbsp;entries...
                                                    </i>
                                                </strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className={classes.root}>
                                                {entriesByType[type]?.map((entry, index2) => (
                                                    <Accordion
                                                        key={index2}
                                                        className="rIInnerAccordion"
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                        >
                                                            <Typography className={classes.heading}>
                                                                <strong>
                                                                    (
                                                                    {entry.shortdef.length}
                                                                    )
                                                                    <span className="rIOrange">
                                                                        &nbsp;-
                                                                    </span>
                                                                    <span className="text-muted">
                                                                        &nbsp;
                                                                        {'{'}
                                                                        &nbsp;
                                                                        {entry.meta.id}
                                                                        &nbsp;
                                                                        {'}'}
                                                                    </span>
                                                                    {(entry.meta.offensive === true) && (
                                                                        <i className="mgSmFont">
                                                                            <span className="rIOrange">
                                                                                &ensp;:&ensp;
                                                                            </span>
                                                                            <span className="cdTooltip text-danger">
                                                                                ( ✗ )
                                                                                <span className="cdTooltipText">
                                                                                    Offensive?
                                                                                </span>
                                                                            </span>
                                                                        </i>
                                                                    )}
                                                                    {(entry.meta.offensive === false) && (
                                                                        <i className="mgSmFont">
                                                                            <span className="rIOrange">
                                                                                &ensp;:&ensp;
                                                                            </span>
                                                                            <span className="cdTooltip text-success">
                                                                                ( ✔ )
                                                                                <span className="cdTooltipText">
                                                                                    Innoffensive?
                                                                                </span>
                                                                            </span>
                                                                        </i>
                                                                    )}
                                                                </strong>
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <div className={classes.root}>
                                                                <Typography>
                                                                    <strong>
                                                                        [
                                                                        {type.replace(type[0], type[0].toUpperCase())}
                                                                        ]
                                                                    </strong>
                                                                    {(entry.hwi && entry.hwi.hw) && (
                                                                        <span className="text-muted">
                                                                            <strong>
                                                                                <span className="rIOrange">
                                                                                    &ensp;&ensp;|&nbsp;
                                                                                </span>
                                                                                "
                                                                                {entry.hwi.hw}
                                                                                "&nbsp;
                                                                            </strong>
                                                                        </span>
                                                                    )}
                                                                </Typography>
                                                                <br />
                                                                {entry.shortdef?.map((def, index3) => (
                                                                    <div key={index3}>
                                                                        <Typography>
                                                                            <strong>
                                                                                {index3 + 1}:
                                                                            </strong>
                                                                            &emsp;
                                                                            {def}
                                                                            ;
                                                                        </Typography>
                                                                        {(entry.def && entry.def[0] && entry.def[0].sseq[index3] && entry.def[0].sseq[index3][0] && entry.def[0].sseq[index3][0][1] && entry.def[0].sseq[index3][0][1].dt && entry.def[0].sseq[index3][0][1].dt[1] && entry.def[0].sseq[index3][0][1].dt[1][1] && entry.def[0].sseq[index3][0][1].dt[1][1][0] && entry.def[0].sseq[index3][0][1].dt[1][1][0].t && entry.def[0].sseq[index3][0][1].dt[1][1][0].t) && (
                                                                            <>
                                                                                <br />
                                                                                <Typography>
                                                                                    <i>
                                                                                        <strong>
                                                                                            <span className="rIOrange">
                                                                                                &emsp;&emsp;*&ensp;
                                                                                            </span>
                                                                                        </strong>
                                                                                        <span className="rIPurple">
                                                                                            e.g.,&nbsp;
                                                                                        </span>
                                                                                        <strong>
                                                                                            <span className="text-muted">
                                                                                                "&nbsp;...&ensp;
                                                                                                {entry.def[0].sseq[index3][0][1].dt[1][1][0].t}
                                                                                                &nbsp;"
                                                                                            </span>
                                                                                        </strong>
                                                                                    </i>
                                                                                </Typography>
                                                                                <br />
                                                                            </>
                                                                        )}
                                                                        <br />
                                                                        <ul className="inlineList">
                                                                            <li className="mgInlineBlock text-muted">
                                                                                <Typography>
                                                                                    <strong>
                                                                                        <i>
                                                                                            &emsp;Synonyms :&nbsp;
                                                                                        </i>
                                                                                    </strong>
                                                                                </Typography>
                                                                            </li>
                                                                            {entry.meta.syns[index3]?.map((syn, index4) => (
                                                                                <li key={index4} className="mgInlineBlock">
                                                                                    <Typography>
                                                                                        &nbsp;
                                                                                        <Link to={`/search/${syn}`} >
                                                                                            <span className="rIPurple">
                                                                                                <i>
                                                                                                    {syn}
                                                                                                </i>
                                                                                            </span>
                                                                                        </Link>
                                                                                        {(entry.meta.syns[index3].indexOf(syn) !== (entry.meta.syns[index3].length - 1)) && (
                                                                                            <>
                                                                                                ,
                                                                                            </>
                                                                                        )}
                                                                                    </Typography>
                                                                                </li>
                                                                            ))}
                                                                            {!(entry?.meta?.syns[index3]?.length > 0) && (
                                                                                <li className="mgInlineBlock">
                                                                                    <Typography>
                                                                                        <span className="rIPurple">
                                                                                            <i>
                                                                                                (N/A)
                                                                                            </i>
                                                                                        </span>
                                                                                    </Typography>
                                                                                </li>
                                                                            )}
                                                                        </ul>
                                                                        <ul className="inlineList">
                                                                            <li className="mgInlineBlock text-muted">
                                                                                <Typography>
                                                                                    <strong>
                                                                                        <i>
                                                                                            &emsp;Antonyms :&nbsp;
                                                                                        </i>
                                                                                    </strong>
                                                                                </Typography>
                                                                            </li>
                                                                            {entry.meta.ants[index3]?.map((ant, index4) => (
                                                                                <li key={index4} className="mgInlineBlock">
                                                                                    <Typography>
                                                                                        &nbsp;
                                                                                        <Link to={`/search/${ant}`} >
                                                                                            <span className="rIPurple">
                                                                                                <i>
                                                                                                    {ant}
                                                                                                </i>
                                                                                            </span>
                                                                                        </Link>
                                                                                        {(entry.meta.ants[index3].indexOf(ant) !== (entry.meta.ants[index3].length - 1)) && (
                                                                                            <>
                                                                                                ,
                                                                                            </>
                                                                                        )}
                                                                                    </Typography>
                                                                                </li>
                                                                            ))}
                                                                            {!(entry?.meta?.ants[index3]?.length > 0) && (
                                                                                <li className="mgInlineBlock">
                                                                                    <Typography>
                                                                                        <span className="rIPurple">
                                                                                            <i>
                                                                                                (N/A)
                                                                                            </i>
                                                                                        </span>
                                                                                    </Typography>
                                                                                </li>
                                                                            )}
                                                                            <br />
                                                                            <br />
                                                                        </ul>
                                                                        <hr />
                                                                        <br />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ))}
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
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


export default MWThesRes;