import React, { useState } from "react";

import axios from 'axios';
import { navigate } from '@reach/router';

import { Button } from 'react-bootstrap';

import { Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';



// defines style rulesets for Material UI components
const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        marginBottom: '1rem',
    },
    paper: {
        padding: "40px 20px",
        backgroundColor: '#acff2f88',
        borderRadius: '23px',
        border: '2px solid black',
        marginTop: '1.5rem',
    },
    heading: {
        margin: 0,
        textAlign: "left",
    },
    divider: {
        margin: "30px 0",
    },
}));


// ImportExportFavs displays all comments for the query and allows the user to post if they are logged in
const ImportExportFavs = props => {

    // retrieves state variables from props
    const { envUrl,
        user,
        setLogged } = props;

    // generates CSS rulesets
    const classes = useStyles();

    // state variables to handle comments
    const [imports, setImports] = useState([]);
    const [exportErrors, setExportErrors] = useState([]);
    const [importErrors, setImportErrors] = useState([]);


    // update the user with the new favorites
    const updateUser = newUser => {
        axios.put(`${envUrl}/api/users`, newUser, { withCredentials: true })
            .then(res => {
                setLogged(res.data.user);
            })
            .catch(err => {
                if (err.response?.status === 401)
                    navigate('/login');
            });
    };

    // handler to update imports list on input change
    const handleInputChange = e => {
        setImports(e.target.value);
    };

    // handler when the imports are submitted
    const handleImport = e => {
        // prevent default behavior of the submit
        e.preventDefault();
        // validates imports and updates favorites
        if (imports.length > 0 && imports.replace(/\s/g, '').length > 0) {
            const words = imports.split(',');
            // add words to the favorites list if not present
            for (let word of words)
                if (word.replace(/\s/g, '').length && !user.favs.includes(word.toLowerCase()))
                    user.favs.push(word.trim().replace(/\//g, '%2F').toLowerCase());
            // favorite the words
            updateUser(user);
            // clear comment box and errors after submit
            setImportErrors([]);
            setImports([]);
        } else {
            setImportErrors(["*You can't import an empty list!"]);
        }
    };

    // handler to export the favorites
    const handleExport = e => {
        // prevent default behavior of the submit
        e.preventDefault();
        if (user.favs.length > 0) {
            // const favsFile = new Blob(user.favs, { type: "text/plain;charset=utf-8" });
            // saveAs(favsFile, "cdFavs.txt");
            let prettyFavs = user.favs;
            prettyFavs = prettyFavs.toString().replace(/,/g, ', ').replace(/%2f/g, '/');
            prettyFavs = (`@${user.userName} ~ (${user.favs.length}): `).concat(prettyFavs);
            // prettyFavs = prettyFavs.replace(',', ':');
            function download(filename, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
            // clear any errors and start the download
            setExportErrors([]);
            download("cdFavs", prettyFavs);
        } else {
            setExportErrors(["*You can't export an empty list!"]);
        }
    };


    // returns a form to import and export favorites
    return (
        <>
            <Paper className={classes.paper}>
                <h2 className="qQuotes resHeading mb-sm-3">
                    <strong>
                        <i>
                            * Import Favorites! *
                        </i>
                    </strong>
                </h2>
                <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleImport}
                >
                    <Typography className="rIPurple resHeading mb-sm-3">
                        <strong>
                            <i>
                                - Enter a list of queries to import, seperated by commas -
                            </i>
                        </strong>
                    </Typography>
                    <br />
                    <TextField
                        id="outlined-basic"
                        label="Query 1, query 2, etc..."
                        name="newImports"
                        variant="outlined"
                        multiline
                        className="commentBox"
                        onChange={handleInputChange}
                        value={imports}
                    />
                    {importErrors?.map((err, index) => (
                        <Typography
                            className="text-danger resHeading"
                            key={index}
                        >
                            <strong>
                                <i>
                                    {err}
                                </i>
                            </strong>
                        </Typography>
                    ))}
                    <Button
                        type="submit"
                        variant="contained"
                        className="formButt mt-sm-3"
                    >
                        <strong>
                            Import!
                        </strong>
                    </Button>
                </form>
                <Divider
                    variant="fullWidth"
                    className={classes.divider}
                />
                <h2 className="qQuotes resHeading mb-sm-3">
                    <strong>
                        <i>
                            * Export Favorites! *
                        </i>
                    </strong>
                </h2>
                <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleExport}
                >
                    <Typography className="rIPurple resHeading mb-sm-3">
                        <strong>
                            <i>
                                - Downloads a text file containing your list of favorite queries -
                            </i>
                        </strong>
                    </Typography>
                    <br />
                    {exportErrors?.map((err, index) => (
                        <Typography
                            className="text-danger resHeading"
                            key={index}
                        >
                            <strong>
                                <i>
                                    {err}
                                </i>
                            </strong>
                        </Typography>
                    ))}
                    <Button
                        type="submit"
                        variant="contained"
                        className="formButt mt-sm-3"
                    >
                        <strong>
                            Export!
                        </strong>
                    </Button>
                </form>
            </Paper>
        </>
    );
}


export default ImportExportFavs;