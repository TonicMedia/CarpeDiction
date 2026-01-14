import React, { useEffect } from 'react';

import { navigate } from '@reach/router';

import DeleteButton from '../components/user/DeleteButton';
import NavBar from '../components/common/NavBar';
import StickyFooter from '../components/common/StickyFooter';

import { Button } from 'react-bootstrap';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';



// defines style rulesets for Material UI components
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
    },
}));


// Delete view is used for confirmation of account deletion
const Delete = props => {

    // retrieves state variables from props
    const { envUrl,
        logged,
        setLogged,
        setAudioLoaded,
        setSyllables } = props;

    // generates CSS rulesets
    const classes = useStyles();


    // redirects to home if no User logged in
    useEffect(() => {
        if (logged === null)
            navigate('/login');
    });


    // displays account deletion confirmation page
    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavBar
                envUrl={envUrl}
                logged={logged}
                setLogged={setLogged}
                setAudioLoaded={setAudioLoaded}
                setSyllables={setSyllables}
            />
            <div className="chocolate">
                <div className={classes.paper}>
                    <Typography
                        component="h1"
                        variant="h4"
                    >
                        Delete your account?
                    </Typography>
                    <br />
                    <Typography
                        component="h1"
                        variant="h5"
                        className="text-danger"
                    >
                        This&nbsp;
                        <u>
                            <i>
                                cannot
                            </i>
                        </u>
                        &nbsp;be undone!</Typography>
                    <br />
                    <br />
                    <br />
                    <Container maxWidth="sm">
                        <Button
                            onClick={() => navigate("/user/account/edit")}
                            size="lg"
                            variant="light"
                            className="formButt"
                        >
                            <strong>
                                Please, no!
                            </strong>
                        </Button>
                    </Container>
                    <br />
                    <br />
                    <DeleteButton
                        envUrl={envUrl}
                        successCallback={() => navigate("/")}
                        logged={logged}
                        setLogged={setLogged}
                        buttFunc={'user'}
                    />
                </ div>
            </div>
            <StickyFooter />
        </div>
    );
};


export default Delete;