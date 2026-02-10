import React, { useEffect } from 'react';

import { navigate } from '@reach/router';



// redirects to home page for all unhandled URLs
const NotFound = _props => {

    // redirects to home
    useEffect(() => {
        navigate('/');
    });

    // returns null element
    return (
        <>
        </>
    );
};


export default NotFound;