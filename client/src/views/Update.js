import React, { useEffect, useState } from 'react';

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


// Update view is for updating account info
const Update = props => {

    // retrieves state variables from props
    const { envUrl,
        logged,
        setLogged,
        setAudioLoaded,
        setSyllables } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // local logged variable for the GET hook to track intermediately, preventing logout errors
    const [localUser] = useState(logged);

    // state variables to hold the User data and whether or not it has loaded
    const [user, setUser] = useState();
    const [loaded, setLoaded] = useState(false);

    // state to keep track of an array of errors from UpdateForm
    const [errors, setErrors] = useState([]);


    // redirects to home if no User logged in
    useEffect(() => {
        if (logged === null)
            navigate('/login');
    });

    // retrieves the User and updates the state variables with its info
    useEffect(() => {
        axios.get(`${envUrl}/api/users/${localUser._id}`, { withCredentials: true })
            .then(res => {
                setUser(res.data.user);
                setLoaded(true);
            })
            .catch(err => {
                if (err.response.status === 401)
                    navigate('/login');
            });
    }, [localUser]);

    // updates the User's data with the new data
    const updateUser = user => {
        axios.put(`${envUrl}/api/users`, user, { withCredentials: true })
            .then(res => {
                setLogged(res.data.user);
                navigate("/user/account");
            })
            .catch(err => {
                if (err.response.status === 401)
                    navigate('/login');
                if (err.response.data.errors) {
                    const errorResponse = err.response.data.errors;
                    const errorArr = [];
                    for (const key of Object.keys(errorResponse)) {
                        errorArr.push(errorResponse[key].message)
                    }
                    setErrors(errorArr);
                } else {
                    setErrors([`${err.response.status}: ${err.response.statusText}`]);
                }
            });
    };


    // displays User update page
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
                {loaded && (
                    <>
                        <UserForm
                            submitCallback={updateUser}
                            formFunc="Update"
                            logged={logged}
                            setLogged={setLogged}
                            initialUser={user}
                            errors={errors}
                        />
                    </>
                )}
            </div>
            <StickyFooter />
        </div>
    );
};


export default Update;