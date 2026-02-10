import React, { useState, useEffect } from 'react';

import axios from 'axios';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { Divider } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { encodeSearchQuery } from '../../utils/searchUtils';
import { searchAccordionStyles } from './searchAccordionStyles';

const useStyles = makeStyles((theme) => ({
    ...searchAccordionStyles(theme),
    divider: { margin: "30px 0" },
}));


// UrbanDict retrieves and displays query results from the unofficial Urban Dictionary API
const UrbanDict = props => {

    // retrieves search variables from props
    const { query } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of search progress and results
    const [entries, setEntries] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const controller = new AbortController();
        const options = {
            method: 'GET',
            url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
            params: { term: encodeSearchQuery(query) },
            headers: {
                'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
                'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com'
            },
            signal: controller.signal,
        };
        axios.request(options)
            .then(res => {
                // generates an array of the entries found by the search
                const resEntries = [];
                let definitions = [];
                let examples = [];
                for (const entry in res.data.list) {
                    if (res.data.list[entry].definition) {
                        definitions = res.data.list[entry].definition.split('\r\n');
                        res.data.list[entry].definition = [];
                        for (const newDef in definitions)
                            if (definitions[newDef].replace(/\s/g, '').length) {
                                definitions[newDef] = definitions[newDef].replace(/[1-9]\./g, '')
                                definitions[newDef] = definitions[newDef].replace(/\[/g, '')
                                definitions[newDef] = definitions[newDef].replace(/\]/g, '')
                                res.data.list[entry].definition.push(definitions[newDef]);
                            }
                    }
                    if (res.data.list[entry].example) {
                        examples = res.data.list[entry].example.split('\r\n');
                        res.data.list[entry].example = [];
                        for (const newEx in examples)
                            if (examples[newEx].replace(/\s/g, '').length) {
                                examples[newEx] = examples[newEx].replace(/[1-9]\./g, '')
                                examples[newEx] = examples[newEx].replace(/\[/g, '')
                                examples[newEx] = examples[newEx].replace(/\]/g, '')
                                res.data.list[entry].example.push(examples[newEx]);
                            }
                    }
                    resEntries.push(res.data.list[entry]);
                }
                // updates all pertinent state variables
                if (resEntries.length === 0) {
                    setError(`No results from Urban Dictionary API...`);
                    setEntries(null);
                    setLoaded(false);
                } else {
                    setError(null);
                    setEntries(resEntries);
                    setLoaded(true);
                }
            })
            .catch((err) => {
                if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
                setError(`No results from Urban Dictionary API...`);
                setEntries(null);
                setLoaded(false);
            });
        return () => controller.abort();
    }, [query]);


    // returns a material UI accordion component displaying the results from the Urban Dictionary API
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
                            xs={7}
                        >
                            <Typography className={classes.heading}>
                                <strong>
                                    (
                                    {(entries?.length > 0) && (
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
                                            Urban Dictionary
                                        </u>
                                    </i>
                                </strong>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={5}
                            className="mgTxtRight"
                        >
                            <Typography className={classes.heading}>
                                <strong className="mgSmFont">
                                    <i>
                                        <span className="rIOrange">
                                            ...&nbsp;
                                        </span>
                                        <span className="text-danger">
                                            may be offensive!
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
                                {entries?.map((entry, index) => (
                                    <Accordion
                                        key={index}
                                        className="rIInnerAccordion"
                                    >
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
                                                    xs={9}
                                                >
                                                    <Typography className={classes.heading}>
                                                        <strong>
                                                            <span className="rIOrange">
                                                                #&nbsp;
                                                            </span>
                                                            {index + 1}
                                                            <span className="rIOrange">
                                                                &nbsp;-
                                                            </span>
                                                            <span className="text-muted">
                                                                &nbsp;
                                                                {'{'}
                                                                &nbsp;
                                                                {entry.word}
                                                                :
                                                                {entry.defid}
                                                                &nbsp;
                                                                {'}'}
                                                            </span>
                                                        </strong>
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={3}
                                                    className="mgTxtRight"
                                                >
                                                    <Typography>
                                                        <strong className="mgSmFont">
                                                            <span className="cdTooltip">
                                                                <span className="text-success">
                                                                    👍&nbsp;
                                                                    <span className="cdTooltipText">
                                                                        <i>
                                                                            Likes!
                                                                        </i>
                                                                    </span>
                                                                </span>
                                                                <span className="rIPurple">
                                                                    {entry.thumbs_up}
                                                                </span>
                                                            </span>
                                                            <span className="rIOrange">
                                                                &nbsp;:&nbsp;
                                                            </span>
                                                            <span className="cdTooltip">
                                                                <span className=" text-danger">
                                                                    👎&nbsp;
                                                                    <span className="cdTooltipText">
                                                                        <i>
                                                                            Dislikes!
                                                                        </i>
                                                                    </span>
                                                                </span>
                                                                <span className="rIPurple">
                                                                    {entry.thumbs_down}
                                                                </span>
                                                            </span>
                                                        </strong>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className={classes.root}>
                                                {entry.definition && (
                                                    entry.definition.map((def, index2) => (
                                                        <div key={index2}>
                                                            <Typography>
                                                                <span className="rIOrange">
                                                                    &emsp;[&ensp;
                                                                </span>
                                                                <span className="text-muted">
                                                                    "
                                                                    {entry.word}
                                                                    "
                                                                </span>
                                                                <span className="rIOrange">
                                                                    &ensp;]
                                                                </span>
                                                                <br />
                                                                <br />
                                                                <strong>
                                                                    {index2 + 1}
                                                                    :
                                                                </strong>
                                                                &emsp;
                                                                {def}
                                                                <br />
                                                                <br />
                                                                {(entry.example && entry.example[index2]) && (
                                                                    <i>
                                                                        <span className="rIOrange">
                                                                            &emsp;&emsp;*&ensp;
                                                                        </span>
                                                                        <span className="rIPurple">
                                                                            e.g.,&nbsp;
                                                                        </span>
                                                                        <strong>
                                                                            <span className="text-muted">
                                                                                &nbsp;...&ensp;
                                                                                {entry.example[index2]}
                                                                                &nbsp;
                                                                            </span>
                                                                            <br />
                                                                            <br />
                                                                        </strong>
                                                                    </i>
                                                                )}
                                                            </Typography>
                                                            {(entry.definition.indexOf(def) < (entry.definition.length - 1)) && (
                                                                <Divider
                                                                    variant="fullWidth"
                                                                    className={classes.divider}
                                                                />
                                                            )}
                                                        </div>
                                                    ))
                                                )}
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


export default UrbanDict;