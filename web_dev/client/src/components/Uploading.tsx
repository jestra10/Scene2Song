import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import '../styles/Loading.css'
import loadingGif from '../loading.gif'
import { Paper } from '@mui/material';

interface loadProps {
    classifying: boolean;
    preparing: boolean;

}
export function Uploading(props: loadProps) {


    return <div className='loading'>
        {props.classifying ?
            <Paper className='loadingPaper' elevation={5}><img src={loadingGif} alt="Loading..." className="loadinggif" />Classifying your Scene...
            </Paper> : (props.preparing ? <Paper className='loadingPaper' elevation={5}><img src={loadingGif} alt="Loading..." className="loadinggif" />Preparing your Playlist...
            </Paper> : <Paper className='loadingPaper' elevation={5}><img src={loadingGif} alt="Loading..." className="loadinggif" />Uploading your Image...
            </Paper>)
        }
    </div>;
}