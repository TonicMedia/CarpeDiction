import React from 'react';

import Typography from '@material-ui/core/Typography';



// Copyright generates an ever-contemporary copyright statement 
const Copyright = () => {
    return (
        <Typography variant="body2">
            <span className="rIGreen mgSmFont">
                <strong>
                    {'Copyright © '}
                    Zachery A. Bielicki
                    {' '}
                    {new Date().getFullYear()}
                </strong>
            </span>
        </Typography>
    );
};


export default Copyright;