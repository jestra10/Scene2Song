import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Grid2, Paper } from '@mui/material';
import '../styles/Home.css'

interface Props {
    clicked: boolean;
    setClicked: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    img: File | null;
    setImg: Dispatch<SetStateAction<File | null>>;
}
export function Home(props: Props) {
    const [data, setData] = useState(null);
    const upload = async () => {
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

    }


    return <div className='homePage'>
        <Paper className="homePaper" elevation={5}>
            <Grid2>
                <Grid2>
                    <div className='paperTitle'>Upload a Scene</div>
                </Grid2>
                <input className='fileText' type="file" onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        props.setImg(e.target.files[0]);
                    }
                }} />
                <button className='imageButton' onClick={upload}>Upload Image</button>
            </Grid2>
        </Paper></div>;
}
