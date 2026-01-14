import React, { useState } from 'react';

import { Link } from '@reach/router';

const cd_icon = process.env.PUBLIC_URL + '/images/cd_icon.png';

import { Button } from 'react-bootstrap';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';



// defines style rulesets for Material UI components
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


// LoginForm receives User info and makes login request
const LoginForm = props => {

    // grabs the initialLog object, erros array and onSubmitProp function from props
    const { initialLog,
        onSubmitProp,
        errors } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of what is being typed
    const [log, setLog] = useState(initialLog);


    // handler to update state on input change
    const handleInputChange = e => {
        setLog({
            ...log,
            [e.target.name]: e.target.value
        });
    };

    // handler when the form is submitted
    const handleSubmit = e => {
        // prevent default behavior of the submit
        e.preventDefault();
        // make a post request with the onSubmitProp to create a new User
        onSubmitProp(log);
    };


    // returns login form
    return (
        <Container
            component="main"
            maxWidth="xs"
        >
            <CssBaseline />
            <div className={classes.paper}>
                <img
                    src={cd_icon}
                    width="169"
                    height="169"
                    className="d-inline-block"
                    alt="CarpeDiction!"
                />
                <br />
                <Typography
                    component="h1"
                    variant="h5"
                >
                    <span className="rIPurple">
                        <strong>
                            - Welcome back! -
                        </strong>
                    </span>
                </Typography>
                <br />
                <form
                    onSubmit={handleSubmit}
                    className={classes.form}
                    noValidate
                >
                    <Grid
                        container
                        justifyContent="center"
                    >
                        <Grid item>
                            {errors.map((err, index) => (
                                <Typography
                                    className="text-danger"
                                    key={index}
                                >
                                    <strong>
                                        {err}
                                    </strong>
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                    <TextField
                        className="mgFormControl"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email:"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleInputChange}
                    />
                    <TextField
                        className="mgFormControl"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password:"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleInputChange}
                    />
                    <br />
                    <br />
                    <Button
                        type="submit"
                        variant="contained"
                        className="formButt"
                    >
                        <strong>
                            Sign in!
                        </strong>
                    </Button>
                    <br />
                    <br />
                    <Grid
                        container
                        justifyContent="flex-end"
                    >
                        <Link
                            to="/register"
                            className="flatLinkPurple"
                        >
                            <span className="flatLinkPurple">
                                <strong>
                                    Don't have an account? Sign up here! *&emsp;
                                </strong>
                            </span>
                        </Link>
                    </Grid>
                    <hr />
                    <Grid
                        container
                        justifyContent="flex-end"
                    >
                        <Link
                            to={"/"}
                            className="flatLinkPurple"
                        >
                            <span className="flatLinkPurple">
                                <strong>
                                    Nevermind . . .&emsp;
                                </strong>
                            </span>
                        </Link>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};


export default LoginForm;