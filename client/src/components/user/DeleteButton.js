import React from 'react';

import axios from 'axios';
import { navigate } from '@reach/router';

import { Button } from 'react-bootstrap';



// DeleteButton is a reusable button that deletes + logs out the current user
const DeleteButton = props => {

    // retrieves the state variables from props
    const { envUrl,
        logged,
        setLogged,
        comment,
        buttFunc,
        successCallback } = props;


    // function to handle logouts
    const handleLogout = () => {
        axios.get(`${envUrl}/api/logout`, { withCredentials: true })
            .then(res => {
                setLogged(null);
                navigate('/');
            })
            .catch(() => {
                setLogged(null);
                navigate('/');
            });
    };


    // deletes the User
    const deleteUser = e => {
        axios.delete(`${envUrl}/api/users/${logged._id}`, { withCredentials: true })
            .then(res => {
                handleLogout();
                successCallback();
            })
            .catch(err => {
                if (err.response?.status === 401)
                    navigate('/login');
            });
    };

    // deletes the Comment
    const deleteComment = e => {
        axios.delete(`${envUrl}/api/comments/delete/${comment._id}`, { withCredentials: true })
            .then(res => {
                window.location.reload(false);
            })
            .catch(err => {
                if (err.response?.status === 401)
                    navigate('/login');
            });
    }


    // returns a delete button
    return (
        <>
            {buttFunc === 'user' && (
                <Button
                    onClick={() => deleteUser()}
                    size="sm"
                    variant="outline-danger"
                    className="dButt"
                >
                    <strong>
                        Yes, I am a fool!
                    </strong>
                </Button>
            )}
            {buttFunc === 'comment' && (
                <Button
                    onClick={() => deleteComment()}
                    size="sm"
                    variant="outline-danger"
                    className="dButt"
                >
                    <strong>
                        Delete
                    </strong>
                </Button>
            )
            }
        </>
    );
};


export default DeleteButton;