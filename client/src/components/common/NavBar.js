import React, { useState } from 'react';

import axios from 'axios';
import { Link, navigate } from '@reach/router';

import 'bootstrap/dist/css/bootstrap.min.css';
const ri_icon = process.env.PUBLIC_URL + '/images/ri_icon.png';
const carpe_diction = process.env.PUBLIC_URL + '/images/carpe_diction.png';

import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';



// NavBar sticks to the top of the page to handle logout and searching
const NavBar = props => {

    // grabs logged state variables from props
    const { envUrl,
        logged,
        setLogged,
        setAudioLoaded,
        setSyllables } = props;

    // state variables to keep track of what is being typed in search
    const [query, setQuery] = useState("");
    const [softQuery, setSoftQuery] = useState("");

    // handler to update query state on input change
    const handleInputChange = e => {
        setSoftQuery(e.target.value.toLowerCase());
    };

    // handler when the search form is submitted
    const handleSubmit = e => {
        // prevent default behavior of the submit
        e.preventDefault();
        // reset audioLoaded to force rerender of player on Search.js
        if (softQuery.toLowerCase() !== query.toLowerCase()) {
            setAudioLoaded(false);
            setSyllables("");
            setQuery(softQuery.toLowerCase().replace(/\//g, '%2F'));
            // if query is present, redirect to search view, passing along the query
            if (softQuery !== undefined && softQuery.replace(/\s/g, '').length)
                navigate('/search/' + softQuery.toLowerCase().replace(/\//g, '%2F'));
        }
    };

    // function to handle logouts
    const handleLogout = () => {
        navigate('/');

        axios.get(`${envUrl}/api/logout`, { withCredentials: true })
            .then(res => {
                setLogged(null);
            })
            .catch(err => {
                setLogged(null);
            });
    };


    // returns NavBar
    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
        >
            <CssBaseline />
            <Form
                onSubmit={handleSubmit}
                className="mr-auto cdNav"
                inline
            >
                <Navbar.Brand className="cdNav mr-sm-2">
                    <Link to="/">
                        <img
                            src={carpe_diction}
                            width=""
                            height="40"
                            className="d-inline-block mr-sm-1"
                            alt="CarpeDiction!"
                        />
                        <Typography className="d-inline rIOrange ml-sm-1">
                            <i>
                                by&nbsp;
                            </i>
                        </Typography>
                        <img
                            src={ri_icon}
                            width="25"
                            height="25"
                            className="d-inline-block mr-sm-1"
                            alt="rI : "
                        />
                    </Link>
                </Navbar.Brand>
                <div className="sForm cdNav">
                    <FormControl
                        type="text"
                        placeholder="Query..."
                        className="sBox"
                        onChange={handleInputChange}
                    />
                    <Button
                        className="sButt"
                        variant="warning"
                        type="submit"
                    >
                        <strong>
                            Search!
                        </strong>
                    </Button>
                </div>
            </Form>
            <Nav className="cdNav">
                <Navbar.Text>
                    {logged !== null &&
                        <>
                            <i>
                                Signed in as:&nbsp;
                            </i>
                            <Link
                                to="/user/account"
                                className="flatLinkOrange"
                                style={{ textDecoration: "none" }}
                            >
                                <span className="rIOrange">
                                    <strong>
                                        {logged.userName}
                                    </strong>
                                </span>
                            </Link>
                                &ensp;|
                            <i>
                                &ensp;Not you?&ensp;
                            </i>
                            <Button
                                onClick={handleLogout}
                                size="sm"
                                variant="outline-danger"
                                className="ml-sm-1"
                            >
                                <span>
                                    <strong>
                                        Log Out
                                    </strong>
                                </span>
                            </Button>
                        </>
                    }
                    {logged === null &&
                        <>
                            <i>
                                You are browsing as a guest.&nbsp;
                                <Link
                                    to="/register"
                                    className="flatLinkOrange"
                                    style={{ textDecoration: "none" }}
                                >
                                    <span className="flatLinkOrange">
                                        <strong>
                                            Register&nbsp;
                                        </strong>
                                    </span>
                                </Link>
                                or&ensp;
                                <Link
                                    to="/login"
                                    className="flatLinkOrange"
                                    style={{ textDecoration: "none" }}
                                >
                                    <span className="flatLinkOrange">
                                        <strong>
                                            Sign In&nbsp;
                                        </strong>
                                    </span>
                                </Link>
                                to access exclusive features!
                            </i>
                        </>
                    }
                </Navbar.Text>
            </Nav>
        </Navbar>
    );
};


export default NavBar;