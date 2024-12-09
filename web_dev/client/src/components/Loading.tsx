import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import '../styles/Loading.css'
import loadingGif from '../loading.gif'
import { Paper } from '@mui/material';
export function Loading() {


    return <div className='loading'>
        <Paper className='loadingPaper' elevation={5}><img src={loadingGif} alt="Loading..." className="loadinggif" />Uploading your Image...
        </Paper>
    </div>;
}
