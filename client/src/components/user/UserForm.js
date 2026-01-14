import React, { useState } from 'react';

import { Link, navigate } from '@reach/router';

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
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


// UserForm is a multipurpose form meant for registration and account detail updates
const UserForm = props => {

    // grabs the initialUser object, formFunc, errors array and submitCallback function from props
    const { submitCallback,
        formFunc,
        initialUser,
        errors } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to keep track of what is being typed
    const [user, setUser] = useState(initialUser);


    // handler to update state on input change
    const handleInputChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    // handler when the form is submitted
    const handleSubmit = e => {
        // prevent default behavior of the submit
        e.preventDefault();
        // make a post request with the submitCallback to create a new User
        submitCallback(user);
    };


    // returns a User account form
    return (
        <Container
            component="main"
            maxWidth="xs"
        >
            <CssBaseline />
            <div className={classes.paper}>
                <img
                    src={cd_icon}
                    width="123"
                    height="123"
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
                            {formFunc === "Update" && (
                                <>
                                    ~ Edit Account ~
                                </>
                            )}
                            {formFunc === "Register" && (
                                <>
                                    + Sign Up! +
                                </>
                            )}
                        </strong>
                    </span>
                </Typography>
                <br />
                {formFunc === "Update" && (
                    <Link
                        to="/user/account"
                        className="flatLinkPurple"
                    >
                        <i>
                            ( Nevermind... )
                        </i>
                    </Link>
                )}
                <form
                    onSubmit={handleSubmit}
                    className={classes.form}
                    noValidate
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            container
                            justifyContent="center"
                        >
                            <Grid item>
                                    {errors?.map((err, index) => (
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
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                className="mgFormControl"
                                variant="outlined"
                                required
                                fullWidth
                                id="userName"
                                label="Username:"
                                name="userName"
                                placeholder={user.userName}
                                autoComplete="username"
                                onChange={handleInputChange}
                            />
                            <Typography
                                className="rIPurple mgSmFont"
                                variant="body2"
                            >
                                <Container>
                                    <strong>
                                        <i>
                                            &ensp;* Username will display on all comments
                                        </i>
                                    </strong>
                                </Container>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                className="mgFormControl"
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email:"
                                name="email"
                                placeholder={user.email}
                                autoComplete="email"
                                onChange={handleInputChange}
                            />
                            <Typography
                                className="rIPurple mgSmFont"
                                variant="body2"
                            >
                                <Container>
                                    <strong>
                                        <i>
                                            &ensp;* Email is for verification purposes only
                                        </i>
                                    </strong>
                                </Container>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                className="mgFormControl"
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password:"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleInputChange}
                            />
                            <Typography
                                className="rIPurple mgSmFont"
                                variant="body2"
                            >
                                <Container>
                                    <strong>
                                        <i>
                                            &ensp;* Password must contain 8 or more characters with no spaces
                                        </i>
                                    </strong>
                                </Container>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                className="mgFormControl"
                                variant="outlined"
                                required
                                fullWidth
                                name="passwordConf"
                                label="Confirm Password:"
                                type="password"
                                id="passwordConf"
                                autoComplete="current-password"
                                onChange={handleInputChange}
                            />
                            <Typography
                                className="rIOrange mgSmFont text-danger"
                                variant="body2"
                            >
                                <Container>
                                    <strong>
                                        <i>
                                            &ensp;* Password can NOT be recovered!
                                        </i>
                                    </strong>
                                </Container>
                            </Typography>
                        </Grid>
                    </Grid>
                    <br />
                    <Button
                        type="submit"
                        variant="contained"
                        className="formButt"
                    >
                        <strong>
                            {formFunc === "Register" && (
                                <>
                                    Register!
                                </>
                            )}
                            {formFunc === "Update" && (
                                <>
                                    Update!
                                </>
                            )}
                        </strong>
                    </Button>
                    <br />
                    <br />
                    {formFunc === "Register" && (
                        <>
                            <Grid
                                container
                                justifyContent="flex-end"
                            >
                                <Link
                                    to="/login"
                                    className="flatLinkPurple"
                                >
                                    <span className="flatLinkPurple">
                                        <strong>
                                            Already have an account? Sign in here! *&emsp;
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
                        </>
                    )}
                    {formFunc === "Update" && (
                        <>
                            <hr />
                            <Grid
                                container
                                justifyContent="center"
                            >
                                <Button
                                    size="md"
                                    variant="outline-danger"
                                    className="dButt"
                                    onClick={() => navigate("/user/account/delete")}
                                >
                                    <strong>
                                        Delete Account?
                                    </strong>
                                </Button>
                            </Grid>
                        </>
                    )}
                </form>
            </div>
        </Container>
    );
};


export default UserForm;