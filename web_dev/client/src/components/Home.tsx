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
        } catch (error) {
            console.error('Upload failed:', error);
            props.setLoading(false);
        }
        try {
            props.setClassifying(true);
            const response = await fetch('http://localhost:5001/classify', {
                method: 'GET'
            });
            const result = await response.json();
            console.log('classify successful:', result);
            props.setClassifying(false);
            console.log('classify false')
            props.setScene(result.body)
        } catch (error) {
            console.error('classify failed:', error);
            props.setClassifying(false);
        }
        try {
            props.setPreparing(true);
            const response = await fetch('http://localhost:5001/songlist?scene=${props.scene}', {
                method: 'GET'
            });
            const result = await response.json();
            props.setPreparing(false);
            props.setSongs(result.body);
            props.setResultsReady(true);
            console.log('song list successful:', result);
        } catch (error) {
            console.error('song list failed:', error);
            props.setPreparing(false);
        }

    }


    return <div className='homePage'>
        <Paper className="homePaper" elevation={5}>
            <Grid2>
                <Grid2>
                    <div className='paperTitle'>Upload a Scene</div>
                </Grid2>
                <Grid2 className='centerContent'>
                    {props.img == null ? <div></div> : <img src={URL.createObjectURL(props.img)} className="homeImg" alt="Result" />}
                    <Grid2 className="flexRow"><input className='fileText' type="file" accept='.png, .jpg, .jpeg' onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            props.setImg(e.target.files[0]);
                        }
                    }} />

                        <button className='imageButton' onClick={upload}>Upload Image</button>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Paper></div>;
}
