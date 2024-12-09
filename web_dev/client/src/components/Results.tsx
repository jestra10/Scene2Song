import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import '../styles/Loading.css'
import { Grid, Grid2, Paper } from '@mui/material';

interface Props {
    setClicked: Dispatch<SetStateAction<boolean>>
}
export function Results(props: Props) {


    return <div className='loading'> <Paper className='loadingPaper' elevation={5}><Grid2><Grid2>RESULTS</Grid2>
        <button onClick={() => props.setClicked(false)}> Upload a New Image</button></Grid2>
    </Paper>
    </div>;
}
