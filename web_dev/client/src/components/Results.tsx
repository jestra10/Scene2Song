import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import '../styles/Loading.css'
import { Grid, Grid2, Paper } from '@mui/material';

interface Props {
    setClicked: Dispatch<SetStateAction<boolean>>;
    img: File | null;
}
export function Results(props: Props) {

    const imageUrl = props.img ? URL.createObjectURL(props.img) : undefined;


    return <div className='loading'> <Paper className='resultsPaper' elevation={5}><Grid2><img src={imageUrl} ></img><Grid2>RESULTS</Grid2>
        <button onClick={() => props.setClicked(false)}> Upload a New Image</button></Grid2>
    </Paper>
    </div>;
}
