import React, { useState, useEffect } from 'react';

import axios from 'axios';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { Divider } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { encodeSearchQuery } from '../../utils/searchUtils';
import { searchAccordionStyles } from './searchAccordionStyles';

const useStyles = makeStyles((theme) => ({
    ...searchAccordionStyles(theme),
    divider: { margin: "30px 0" },
}));


// MwDictRes retrieves and displays query results from the Merriam-Webster Collegiate Dictionary API
const MwDictRes = props => {

    // retrieves search variables from props
    const { query,
        setIsOffensive,
        setNotOffensive,
        setPronunciations,
        mp3s,
        setMp3s,
        wavs,
        setWavs,
        audioLoaded,
        setAudioLoaded,
        setHeadWords,
        setSpellings } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of search progress and results
    const [entries, setEntries] = useState([]);
    const [entriesByType, setEntriesByType] = useState({});
    const [audioEntries, setAudioEntries] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const controller = new AbortController();
        const encQuery = encodeSearchQuery(query);
        axios.get(`https://dictionaryapi.com/api/v3/references/collegiate/json/${encQuery}?key=${process.env.REACT_APP_MW_DICT_KEY}`, { signal: controller.signal })
            .then(res => {
                // generates an array of the entries found by the search or an array of spellcheck suggestion if no entries found
                const resEntries = [];
                const newSpellings = [];
                for (const entryKey of Object.keys(res.data)) {
                    if (res.data[entryKey].fl !== undefined) {
                        resEntries.push(res.data[entryKey]);
                    } else if (!res.data[entryKey].hwi) {
                        newSpellings.push(res.data[entryKey]);
                    }
                }
                setEntries(resEntries);
                setSpellings(newSpellings);

                // generates an object with key for each type of entry found and values containing arrays of entries matching the type
                const entryTypes = {}
                // local offensive counters to manipulate and push their sums to overall offensive score
                let isOffensive = 0;
                let notOffensive = 0;
                let newHeadWords = [];
                let newPronunciations = [];
                let newAudioEntries = [];
                let newMp3s = {};
                let newWavs = {};

                // processes each entry retrieved
                for (const entry of resEntries) {
                    // variables to hold entry data
                    const newEntry = entry;
                    // tallies offensive entries
                    (newEntry.meta.offensive === true) ? isOffensive += 1 : notOffensive += 1;
                    // gathers pronunciation data if present
                    if (newEntry.hwi && newEntry.hwi.prs && newEntry.hwi.prs[0] && newEntry.hwi.prs[0].mw)
                        newPronunciations.push(newEntry.hwi.prs[0].mw);
                    // gathers headwords if present
                    if (newEntry.hwi && newEntry.hwi.hw && !newHeadWords.includes(newEntry.hwi.hw))
                        newHeadWords.push(newEntry.hwi.hw.replace(/(\*+)/g, ''));
                    // removes format bracket pairs and edits leftover references to other entries from origin data.\, if present
                    if (newEntry.et && newEntry.et[0][1]) {
                        newEntry.et[0][1] = newEntry.et[0][1].replace(/see/g, 'see:');
                        newEntry.et[0][1] = newEntry.et[0][1].replace(/et_link\|/g, 'see: |');
                        newEntry.et[0][1] = newEntry.et[0][1].replace(/dxt\|/g, '');
                        newEntry.et[0][1] = newEntry.et[0][1].replace(/\|\|\}/g, ' }');
                        newEntry.et[0][1] = newEntry.et[0][1].replace(/\{.{1,8}\}/g, '');
                        newEntry.et[0][1] = newEntry.et[0][1].replace(newEntry.et[0][1][0], newEntry.et[0][1][0].toUpperCase())
                    }
                    // removes format bracket pairs and edits leftover references to other entries from the origin data's note, if present
                    if (newEntry.et && newEntry.et[1] && newEntry.et[1][1] && newEntry.et[1][1][0] && newEntry.et[1][1][0][1]) {
                        newEntry.et[1][1][0][1] = newEntry.et[1][1][0][1].replace(/see/g, 'see:');
                        newEntry.et[1][1][0][1] = newEntry.et[1][1][0][1].replace(/et_link\|/g, '');
                        newEntry.et[1][1][0][1] = newEntry.et[1][1][0][1].replace(/\{.{1,8}\}/g, '');
                        newEntry.et[1][1][0][1] = newEntry.et[1][1][0][1].replace(newEntry.et[1][1][0][1][0], newEntry.et[1][1][0][1][0].toUpperCase())
                    }
                    // checks if the type of entry exists in the object and adds it to the appropriate array if so, and creates a new one if not
                    if (`${newEntry.fl}` in entryTypes) {
                        entryTypes[`${newEntry.fl}`].entries.push(newEntry);
                    } else {
                        entryTypes[`${newEntry.fl}`] = {
                            entries: [newEntry],
                            hasAudio: 0
                        };
                    }
                    // notes and gathers any entries with audio
                    if (newEntry.hwi && newEntry.hwi.prs && newEntry.hwi.prs[0] && newEntry.hwi.prs[0].sound) {
                        entryTypes[`${newEntry.fl}`].hasAudio += 1;
                        newAudioEntries.push(newEntry);
                    }
                }
                // determines which subdirectory to place in the URL request based on rules from MW API docs
                for (let i = 0; i < newAudioEntries.length; i++) {
                    let subDirectory = "";
                    if (newAudioEntries[i].hwi.prs[0].sound.audio.toString().slice(0, 3) === "bix") {
                        subDirectory = "bix";
                    } else if (newAudioEntries[i].hwi.prs[0].sound.audio.toString().slice(0, 2) === "gg") {
                        subDirectory = "gg";
                    } else if (!!newAudioEntries[i].hwi.prs[0].sound.audio.toString()[0].match(/^[`~@#$%^&*()_=+/-[\]{}\\|.,:;!?'"<>123456789]/)) {
                        subDirectory = "number";
                    } else {
                        subDirectory = newAudioEntries[i].hwi.prs[0].sound.audio.toString()[0];
                    }
                    newMp3s[newAudioEntries[i].meta.id] = 'https://media.merriam-webster.com/audio/prons/en/us/mp3/' + subDirectory + '/' + newAudioEntries[i].hwi.prs[0].sound.audio + '.mp3';
                    newWavs[newAudioEntries[i].meta.id] = 'https://media.merriam-webster.com/audio/prons/en/us/wav/' + subDirectory + '/' + newAudioEntries[i].hwi.prs[0].sound.audio + '.wav';
                }
                // updates all pertinent state variables
                if (resEntries.length === 0) {
                    setError(`No results from the Merriam-Webster Dictionary...`);
                    setEntries(null);
                    setHeadWords(null);
                    setLoaded(false);
                    setPronunciations([]);
                    setIsOffensive(0);
                    setNotOffensive(0);
                } else {
                    setError(null);
                    setIsOffensive(isOffensive);
                    setNotOffensive(notOffensive);
                    setPronunciations(newPronunciations);
                    setHeadWords(newHeadWords);
                    setEntriesByType(entryTypes);
                    setAudioEntries(newAudioEntries);
                    setMp3s(newMp3s);
                    setWavs(newWavs);
                    setAudioLoaded(true);
                    setLoaded(true);
                }
            })
            .catch((err) => {
                if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
                setError(`No results from the Merriam-Webster Dictionary...`);
                setEntries(null);
                setLoaded(false);
            });
        return () => controller.abort();
    }, [query, setAudioLoaded, setHeadWords, setIsOffensive, setMp3s, setNotOffensive, setPronunciations, setSpellings, setWavs]);


    // returns a material UI accordion component displaying the results from the MW dictionary API
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
                            xs={10}
                        >
                            <Typography className={classes.heading}>
                                <strong>
                                    (
                                    {entries?.length}
                                    {!entries && (
                                        0
                                    )}
                                    )
                                    <span className="rIOrange">
                                        &nbsp;-&nbsp;
                                    </span>
                                    <i>
                                        <u>
                                            Merriam-Webster Dictionary
                                        </u>
                                    </i>
                                </strong>
                            </Typography>
                        </Grid>
                        {audioEntries.length > 0 && (
                            <Grid
                                item
                                xs={2}
                                className="mgTxtRight"
                            >
                                <Typography className={classes.heading}>
                                    <strong className="mgSmFont">
                                        <i>
                                            <span className="rIOrange">
                                                +
                                            </span>
                                            <span className="rIPurple">
                                                &ensp;♪
                                                (
                                                {audioEntries.length}
                                                )
                                            </span>
                                        </i>
                                    </strong>
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
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
                                                            (
                                                            {entriesByType[type].entries.length}
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
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={3}
                                                    className="mgTxtRight"
                                                >
                                                    {entriesByType[type].hasAudio > 0 && (
                                                        <Typography className={classes.heading}>
                                                            <strong className="mgSmFont">
                                                                <i>
                                                                    <span className="rIOrange">
                                                                        +
                                                                    </span>
                                                                    <span className="rIPurple">
                                                                        &ensp;♪
                                                                        (
                                                                        {entriesByType[type].hasAudio}
                                                                        )
                                                                    </span>
                                                                </i>
                                                            </strong>
                                                        </Typography>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className={classes.root}>
                                                {entriesByType[type].entries.map((entry, index2) => (
                                                    <Accordion
                                                        key={index2}
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
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={3}
                                                                    className="mgTxtRight"
                                                                >
                                                                    <Typography className={classes.heading}>
                                                                        {(entry.hwi && entry.hwi.prs && entry.hwi.prs[0] && entry.hwi.prs[0].sound) && (
                                                                            <strong className="mgSmFont">
                                                                                <i>
                                                                                    <span className="rIOrange">
                                                                                        +
                                                                                    </span>
                                                                                    <span className="rIPurple">
                                                                                        &ensp;♪
                                                                                    </span>
                                                                                </i>
                                                                            </strong>
                                                                        )}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <div className={classes.root}>
                                                                {(audioLoaded && (mp3s || wavs)) && (
                                                                    <div className="resHeading" style={{ overflow: 'hidden' }}>
                                                                        {(entry.hwi && entry.hwi.prs && entry.hwi.prs[0] && entry.hwi.prs[0].sound) && (
                                                                            <>
                                                                                <audio controls className="rIAudioSm">
                                                                                    {`${entry.meta.id}` in mp3s && (
                                                                                        <source src={mp3s[entry.meta.id]} type="audio/mpeg" />
                                                                                    )}
                                                                                    {`${entry.meta.id}` in wavs && (
                                                                                        <source src={wavs[entry.meta.id]} type="audio/wav" />
                                                                                    )}
                                                                                    Your browser does not support the audio element!
                                                                                </audio>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <Typography>
                                                                    <strong>
                                                                        [
                                                                        {type.replace(type[0], type[0].toUpperCase())}
                                                                        ]
                                                                        {(entry.hwi && entry.hwi.hw) && (
                                                                            <span className="text-muted">
                                                                                <span className="rIOrange">
                                                                                    &ensp;&ensp;|&nbsp;
                                                                                </span>
                                                                                "
                                                                                {entry.hwi.hw}
                                                                                "&nbsp;
                                                                            </span>
                                                                        )}
                                                                        {(entry.hwi && entry.hwi.prs && entry.hwi.prs[0] && entry.hwi.prs[0].mw) && (
                                                                            <>
                                                                                <span className="rIOrange">
                                                                                    |
                                                                                </span>
                                                                                <i>
                                                                                    <span className="text-info">
                                                                                        &nbsp;\&nbsp;
                                                                                        {entry.hwi.prs[0].mw}
                                                                                        &nbsp;\
                                                                                    </span>
                                                                                </i>
                                                                            </>
                                                                        )}
                                                                    </strong>
                                                                </Typography>
                                                                <br />
                                                                    {entry.shortdef?.map((def, index3) => (
                                                                        <Typography key={index3}>
                                                                            <strong>
                                                                                {index3 + 1}
                                                                                :
                                                                            </strong>
                                                                            &emsp;
                                                                            {def}
                                                                            <br />
                                                                            {(entry.shortdef.indexOf(def) < (entry.shortdef.length - 1)) && (
                                                                                <br />
                                                                            )}
                                                                        </Typography>
                                                                    ))}
                                                                {(entry.date || entry.et) && (
                                                                    <>
                                                                        <Divider
                                                                            variant="fullWidth"
                                                                            className={classes.divider}
                                                                        />
                                                                        <Typography>
                                                                            <strong>
                                                                                Origin:&ensp;
                                                                            </strong>
                                                                            {entry.date && (
                                                                                <i className="rIPurple">
                                                                                    {entry.date.replace(/{.*}/g, '')} ;
                                                                                </i>
                                                                            )}
                                                                            <br />
                                                                            <br />
                                                                            {(entry.et && entry.et[0][1]) && (
                                                                                <>
                                                                                    &emsp;
                                                                                    {entry.et[0][1]}
                                                                                    ;
                                                                                </>
                                                                            )}
                                                                            {(entry.et && entry.et[1] && entry.et[1][1] && entry.et[1][1][0] && entry.et[1][1][0][1]) && (
                                                                                <>
                                                                                    <br />
                                                                                    <br />
                                                                                    <i>
                                                                                        <strong>
                                                                                            <span className="rIOrange">
                                                                                                &emsp;&ensp;*&ensp;
                                                                                            </span>
                                                                                            <span className="rIPurple">
                                                                                                Note :&nbsp;
                                                                                            </span>
                                                                                        </strong>
                                                                                        {entry.et[1][1][0][1]}
                                                                                        ;
                                                                                    </i>
                                                                                </>
                                                                            )}
                                                                        </Typography>
                                                                    </>
                                                                )}
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


export default MwDictRes;