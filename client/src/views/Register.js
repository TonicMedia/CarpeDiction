import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { navigate } from '@reach/router';

import NavBar from '../components/common/NavBar';
import StickyFooter from '../components/common/StickyFooter';
import UserForm from '../components/user/UserForm';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';



// defines style rulesets for Material UI components
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
}));


// Register view is for the registration version of the UserForm component 
const Register = props => {

    // retrieves state variables from props
    const { envUrl,
        logged,
        setLogged,
        setAudioLoaded,
        setSyllables } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state to keep track of an array of errors from RegForm
    const [errors, setErrors] = useState([]);

    // creates empty initial registration field values to pass down to form
    const initialReg = {
        userName: "",
        email: "",
        password: "",
        passwordConf: "",
    };


    // redirects to home if User already logged in
    useEffect(() => {
        if (logged !== null)
            navigate('/');
    });

    // API post function; to be passed down to the RegForm
    const createUser = user => {
        setErrors([]);
        // Trim and normalize payload to match server expectations (avoids 400 from empty/whitespace)
        const payload = {
            userName: String(user.userName ?? '').trim(),
            email: String(user.email ?? '').trim(),
            password: user.password ?? '',
            passwordConf: user.passwordConf ?? '',
        };
        axios.post(`${envUrl}/api/register`, payload, { withCredentials: true })
            .then(res => {
                if (res.data.user) {
                    setLogged(res.data.user);
                    navigate("/");
                } else {
                    setErrors(Array.isArray(res.data) ? res.data : ['Registration failed.']);
                }
            })
            .catch(err => {
                const errorResponse = err.response?.data?.errors || {};
                const errorArr = [];
                for (const key of Object.keys(errorResponse)) {
                    const msg = errorResponse[key];
                    errorArr.push(typeof msg === 'string' ? msg : (msg?.message || 'Registration failed.'));
                }
                if (errorArr.length === 0 && err.response?.status === 400) {
                    errorArr.push('Registration failed. Please check your entries.');
                }
                setErrors(errorArr);
            });
    };


    // returns the registration page
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
                <UserForm
                    submitCallback={createUser}
                    formFunc="Register"
                    errors={errors}
                    initialUser={initialReg}
                />
            </div>
            <StickyFooter />
        </div>
    );
};


export default Register;