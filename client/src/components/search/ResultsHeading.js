import React from 'react';

import { navigate } from '@reach/router';

const fav_icon_gray = process.env.PUBLIC_URL + '/images/fav_icon_gray.png';
const fav_icon_orange = process.env.PUBLIC_URL + '/images/fav_icon_orange.png';

import HeadWords from './HeadWords';

import { Button } from 'react-bootstrap';
import { Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';



// defines style rulesets for Material UI components
const useStyles = makeStyles((theme) => ({
    divider: {
        margin: "30px 0",
    },
}));


// ResultsHeading displays the query results heading info gathered from the search components
const ResultsHeading = props => {

    // retrieves the logged, query, and results state variables from props
    const { logged,
        handleFavs,
        headWords,
        spellings,
        pronunciations,
        syllables,
        audioLoaded,
        loaded,
        mp3s,
        wavs,
        isOffensive,
        notOffensive,
        decQuery,
        encQuery } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // returns some basic query results for the results heading
    return (
        <div className="resHeading">
            <h4 className="mb-sm-3 cdTagLine">
                <i>
                    You queried:
                </i>
            </h4>
            <h1 className="mgWordBreak mb-sm-3">
                <strong className="qQuotes">
                    "&nbsp;
                    <span className="rIPurple resHeading">
                        {decQuery}
                    </span>
                    &nbsp;"
                </strong>
            </h1>
            {logged === null && (
                <Button
                    variant="outline-warning"
                    className="cdFavIcon"
                    onClick={() => navigate("/login")}
                >
                    <img
                        src={fav_icon_gray}
                        width="35"
                        height="35"
                        className="d-inline-block"
                        alt="Favorite?"
                    />
                </Button>
            )}
            {(logged !== null) && (logged.favs !== undefined) && !(logged.favs.includes(encQuery)) && (
                <Button
                    variant="outline-warning"
                    className="cdFavIcon"
                    type="submit"
                    onClick={() => handleFavs()}
                >
                    <img
                        src={fav_icon_gray}
                        width="35"
                        height="35"
                        className="d-inline-block"
                        alt="Favorite?"
                    />
                </Button>
            )}
            {(logged !== null) && (logged.favs !== undefined) && (logged.favs.includes(encQuery)) && (
                <Button
                    variant="outline-dark"
                    className="cdFavIcon"
                    onClick={() => handleFavs()}
                >
                    <img
                        src={fav_icon_orange}
                        width="35"
                        height="35"
                        className="d-inline-block"
                        alt="Favorited!"
                    />
                </Button>
            )}
            <HeadWords
                headWords={headWords}
                spellings={spellings}
            />
            <ul className="inlineList topList" style={{marginBottom: '1rem!important'}}>
                {pronunciations?.map((variant, index) => (
                    <li
                        key={index}
                        className="mgInlineBlock"
                    >
                        <h3 className="text-info">
                            <strong>
                                <i>
                                    \&nbsp;
                                    {variant}
                                    &nbsp;
                                    {(pronunciations.indexOf(variant) === (pronunciations.length - 1)) && (
                                        <>
                                            \
                                        </>
                                    )}
                                </i>
                            </strong>
                        </h3>
                    </li>
                ))}
            </ul>
            {(loaded && syllables?.length > 0) && (
                <>
                    <h2>
                        <strong className="text-muted">
                            (&nbsp;
                            <i className="rIOrange syllables">
                                {syllables}
                            </i>
                            &nbsp;)
                        </strong>
                    </h2>
                    <br />
                </>
            )}
            {(audioLoaded && mp3s && ((Object?.keys(mp3s)?.length > 0) || (Object?.keys(wavs)?.length > 0))) && (
                <audio controls className="rIAudio">
                    <source src={mp3s[Object?.keys(mp3s)[0]]} type="audio/mpeg" />
                    <source src={[Object.keys(wavs)[0]]} type="audio/wav" />
                    Your browser does not support the audio element!
                </audio>
            )}
            {isOffensive === 0 && (
                <h6 className="text-success isOffensive">
                    <strong>
                        Your query is not considered offensive by any official sources.
                    </strong>
                </h6>
            )}
            {(isOffensive > 0 && isOffensive <= notOffensive) && (
                <h6 className="text-warning isOffensive">
                    <strong>
                        Your query is considered offensive by some official sources...
                    </strong>
                </h6>
            )}
            {(isOffensive > notOffensive) && (
                <h6 className="text-danger isOffensive">
                    <strong>
                        Your query is considered offensive by most official sources.
                    </strong>
                </h6>
            )}
            <Typography className="text-muted">
                <i>
                    ( some results may take a moment to update )
                </i>
            </Typography>
            <Divider
                variant="fullWidth"
                className={classes.divider}
            />
        </div>
    );
};


export default ResultsHeading;