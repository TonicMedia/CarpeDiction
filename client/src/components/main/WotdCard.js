import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { Link } from '@reach/router';

import WotdArchive from './WotdArchive';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';



// defines style rulesets for Material UI components
const useStyles = makeStyles({
    root: {
        width: '85%',
        marginTop: '3rem',
        marginBottom: '3rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#adff2f',
        border: '2px dashed #800080'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
});


// WotdCard retrieves and displays WOTD and archive accordion
const WotdCard = props => {

    // retrieves state variables from props
    const {envUrl} = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables for handling the WOTD data
    const [word, setWord] = useState("");
    // const [def, setDef] = useState("");
    const [loaded, setLoaded] = useState(false);


    // retrieves the WOTD data
    useEffect(() => {
        let cancelled = false;
        axios.get(`${envUrl}/api/wotd/latest`)
            .then(res => {
                if (cancelled) return;
                const newWord = res.data.Wotd?.word ?? "";
                setWord(newWord);
                setLoaded(true);
            })
            .catch(() => {
                if (cancelled) return;
                setWord("");
                setLoaded(true);
            });
        return () => { cancelled = true; };
    }, [envUrl]);


    // returns WOTD card with archive accordion
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography
                    className="qQuotes"
                    gutterBottom
                    variant="h5"
                    component="h1"
                >
                    <strong>
                        Word of the Day:
                    </strong>
                </Typography>
                <Typography
                    className="rIPurple"
                    variant="h4"
                    component="h2"
                >
                    {!loaded && (
                        <>
                            <strong className="qQuotes">
                                <i>
                                    <span className="rIPurple">
                                        ⏳ Loading... ⌛
                                    </span>
                                </i>
                            </strong>
                            {/* <Typography
                        variant="h6"
                        component="h3"
                        className="rIGrey"
                    >
                        <i>
                            <strong>
                                <br />
                                ...&nbsp;
                                {def}
                            </strong>
                        </i>
                    </Typography> */}
                        </>
                    )}
                    {loaded && (
                        <>
                            <strong className="qQuotes">
                                "
                                <span className="rIPurple">
                                    {word}
                                </span>
                                "
                            </strong>
                            {/* <Typography
                            variant="h6"
                            component="h3"
                            className="rIGrey"
                        >
                            <i>
                                <strong>
                                    <br />
                                    ...&nbsp;
                                    {def}
                                </strong>
                            </i>
                        </Typography> */}
                        </>
                    )}
                </Typography>
            </CardContent>
            <CardActions>
                <Link to={"/search/" + word} className="mgMargAuto flatLinkWotd">
                    <strong>
                        <i>
                            * Learn more! *
                        </i>
                    </strong>
                </Link>
            </CardActions>
            <WotdArchive envUrl={envUrl} />
        </Card>
    );
}


export default WotdCard;