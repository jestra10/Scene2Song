import React, { useEffect, useState } from 'react';
import { Home } from "./Home.tsx";
import Grid from '@mui/material/Grid2';
import '../styles/App.css'
import { Uploading } from './Uploading.tsx';
import { Results } from './Results.tsx';
export interface SongProps {
    title: string;
    artist: string;
    url: string;
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


    return <div ><Grid className='header'>
        <div className='title'>Scene2Song</div>
    </Grid> <div className='main'>{clicked ? (!resultsReady ? <Uploading classifying={classifying} preparing={preparing} /> : <Results setImg={setImg} setClicked={setClicked} img={img} songs={songs} scene={scene} />) : <Home clicked={clicked} setClicked={setClicked} loading={loading} setLoading={setLoading} img={img} setImg={setImg} setClassifying={setClassifying} setPreparing={setPreparing} setSongs={setSongs} setResultsReady={setResultsReady} scene={scene} setScene={setScene} />}</div></div >;
}

export default App;
