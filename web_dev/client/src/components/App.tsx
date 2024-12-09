import React, { useEffect, useState } from 'react';
import { Home } from "./Home.tsx";
import Grid from '@mui/material/Grid2';
import '../styles/App.css'
import { Loading } from './Loading.tsx';
import { Results } from './Results.tsx';


function App() {
  const [data, setData] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<File | null>(null)

  return <div ><Grid className='header'>
    <div className='title'>Scene2Song</div>
  </Grid> <div className='main'>{clicked ? (loading ? <Loading /> : <Results setClicked={setClicked} img={img} />) : <Home clicked={clicked} setClicked={setClicked} loading={loading} setLoading={setLoading} img={img} setImg={setImg} />}</div></div >;
}

export default App;
