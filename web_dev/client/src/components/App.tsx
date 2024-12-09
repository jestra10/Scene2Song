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
  useEffect(() => {
    fetch('http://localhost:5001/api')
      .then((response) => response.json())
      .then((data) => setData(data.message));
  }, []);

  return <div ><Grid className='header'>
    <div className='title'>Scene2Song</div>
  </Grid> {clicked ? (loading ? <Loading /> : <Results />) : <Home clicked={clicked} setClicked={setClicked} loading={loading} setLoading={setLoading} />} </div >;
}

export default App;
