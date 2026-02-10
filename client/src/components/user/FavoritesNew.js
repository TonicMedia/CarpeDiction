import React from 'react';

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


// FavoritesAZ retrieves a list of the user's favorite words sorted alphabetically
const FavoritesNew = props => {

    // retrieves user data from props
    const { user } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // local list to hold favs for sorting so as not to mutate original
    const favsSorted = user.favs.slice().reverse();

    // returns a material UI accordion component displaying the user's favorites list
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
                                <u>
                                    {user.userName}
                                    's Favorite Queries (Most Recent)
                                </u>
                            </i>
                        </strong>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.root}>
                        <ul className="inlineList">
                            {favsSorted?.map((word, index) => (
                                <li key={index} className="mgInlineBlock">
                                    <Typography>
                                        &nbsp;
                                        <Link to={"/search/" + word.replace(/\//g, '%2F')}>
                                            <i>
                                                <span className="rIPurple mgWordBreak">
                                                    {word.replace(/%2f/g, '/')}
                                                </span>
                                            </i>
                                        </Link>
                                        {(favsSorted.indexOf(word) !== (favsSorted.length - 1)) && (
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
                        {favsSorted.length === 0 && (
                            <Typography className="text-danger mgWordBreak">
                                <strong>
                                    <i>
                                        * You have not favorited any queries!
                                    </i>
                                </strong>
                            </Typography>
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div >
    );
}


export default FavoritesNew;