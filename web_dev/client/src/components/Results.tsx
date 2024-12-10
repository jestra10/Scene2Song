import React, { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import '../styles/Loading.css'
import '../styles/Home.css'
import { Grid, Grid2, Paper } from '@mui/material';
import { SongList } from './Song.tsx';
import { SongProps } from './App.tsx';

interface Props {
    setClicked: Dispatch<SetStateAction<boolean>>;
    img: File | null;
    songs: SongProps[]
}
export function Results(props: Props) {

    const imageUrl = props.img ? URL.createObjectURL(props.img) : undefined;



    return <div className='loading'> <Paper className='resultsPaper' elevation={5}> <Grid2 container direction="column" spacing={2}>
        {/* Top Row: Your Playlist and Button */}
        <Grid2 container justifyContent="space-between" alignItems="center">
            <Grid2>Your Playlist</Grid2>
            <Grid2>
                <button className='imageButton' onClick={() => props.setClicked(false)}>
                    Try a New Image!
                </button>
            </Grid2>
        </Grid2>

        {/* Image */}
        <Grid2>
            <img src={imageUrl} className="resultImg" alt="Result" />
        </Grid2>

        {/* Playlist */}
        <Grid2>
            <div className="centered-div">
                <SongList songs={props.songs} />
            </div>
        </Grid2>
    </Grid2>
    </Paper>
    </div>;
}
