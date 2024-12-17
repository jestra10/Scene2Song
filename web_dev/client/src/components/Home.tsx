import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Grid, Grid2, Paper } from '@mui/material';
import '../styles/Home.css'
import { SongProps } from './App.tsx'

interface Props {
    clicked: boolean;
    setClicked: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    img: File | null;
    setImg: Dispatch<SetStateAction<File | null>>;
    setClassifying: Dispatch<SetStateAction<boolean>>;
    setPreparing: Dispatch<SetStateAction<boolean>>;
    setSongs: Dispatch<SetStateAction<SongProps[]>>;
    setResultsReady: Dispatch<SetStateAction<boolean>>;
    setScene: Dispatch<SetStateAction<string>>;
    scene: string;
    diversity: Number;
    setDiversity: Dispatch<SetStateAction<Number>>;
    playlist_len: Number;
    setPlaylist_len: Dispatch<SetStateAction<Number>>;
}
export function Home(props: Props) {
    const upload = async () => {
        props.setResultsReady(false)
        props.setClicked(true); //change the page
        props.setLoading(true)
        if (!props.img) {
            console.error('No file selected.');
            props.setClicked(false);
            props.setLoading(false);
            return;

        }
        const formData = new FormData()
        formData.append('file', props.img)
        try {
            const response = await fetch('http://localhost:5001/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            console.log("setting loading off")
            props.setLoading(false);
            console.log('Upload successful:', result);
            const filePath = result.file

            props.setClassifying(true);
            console.log(filePath)
            const response1 = await fetch(`http://localhost:5004/classify?filepath=${filePath}&diversity=${props.diversity}&list_len=${props.playlist_len}`, {
                method: 'GET'
            });
            const result1 = await response1.json();
            console.log('classify successful:', result1);
            props.setClassifying(false);
            console.log('classify false')

            props.setScene(result1.scenes[1])
            props.setPreparing(false);
            props.setSongs(result1.songs);
            console.log(result1.songs)
            props.setResultsReady(true);
            console.log('song list successful:', result1);
        } catch (error) {
            console.error('classify failed:', error);
            props.setClassifying(false);
        }

    }


    return <div className='homePage'>
        <Paper className="homePaper" elevation={5}>
            <Grid2 className='centerContent'>
                <Grid2 >
                    <div className='paperTitle'>Upload a Scene</div>
                </Grid2>
                <Grid2 className='centerContent'>
                    <Grid2>{props.img == null ? <div></div> : <img src={URL.createObjectURL(props.img)} className="homeImg" alt="Result" />}</Grid2>
                    <Grid2 className="flexRow">
                        <Grid2 className='rowItem'> <input className='fileText' type="file" accept='.png, .jpg, .jpeg' onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                props.setImg(e.target.files[0]);
                            }
                        }} /> </Grid2>
                        <Grid2 className='rowItem'>
                            <button className='imageButton' onClick={upload}>Upload Image</button>
                        </Grid2>
                    </Grid2>
                    <Grid2 className='flexRow'> <Grid2 className='rowItem'>Diversity Multiplier: <input type='Number' min={1} max={10} defaultValue={3} onChange={(e) => { props.setDiversity(Number(e.target.value)) }}>
                    </input></Grid2>
                        <Grid2 className='rowItem'>
                            Song Number Multiplier: <input type='Number' min={1} max={5} defaultValue={1} onChange={(e) => { props.setPlaylist_len(Number(e.target.value)) }}></input></Grid2>

                    </Grid2>
                </Grid2>
            </Grid2>
        </Paper></div>;
}
