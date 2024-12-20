import React, { useEffect, useState } from 'react';
import { Home } from "./Home.tsx";
import Grid from '@mui/material/Grid2';
import '../styles/App.css'
import { Uploading } from './Uploading.tsx';
import { Results } from './Results.tsx';
export interface SongProps {
    title: string;
    artist: string;
    spotify_url: string;
}

function App() {
    const [data, setData] = useState(null);
    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState<File | null>(null)
    const [classifying, setClassifying] = useState(false)
    const [preparing, setPreparing] = useState(false)
    const [songs, setSongs] = useState<SongProps[]>([])
    const [resultsReady, setResultsReady] = useState(false)
    const [scene, setScene] = useState('')
    const [diversity, setDiversity] = useState<Number>(3)
    const [playlist_len, setPlaylist_len] = useState<Number>(1)


    return <div ><Grid className='header'>
        <div className='title'><button className="titleButton" onClick={() => { setClicked(false); setImg(null); setPreparing(false); setLoading(false); setClassifying(false) }}>Scene2Song</button></div>
    </Grid> <div className='main'>{clicked ? (!resultsReady ? <Uploading classifying={classifying} preparing={preparing} /> : <Results setImg={setImg} setClicked={setClicked} img={img} songs={songs} scene={scene} />) : <Home clicked={clicked} setClicked={setClicked} loading={loading} setLoading={setLoading} img={img} setImg={setImg} setClassifying={setClassifying} setPreparing={setPreparing} setSongs={setSongs} setResultsReady={setResultsReady} scene={scene} setScene={setScene} diversity={diversity} setDiversity={setDiversity} playlist_len={playlist_len} setPlaylist_len={setPlaylist_len} />}</div></div >;
}

export default App;
