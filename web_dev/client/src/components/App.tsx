import React, { useEffect, useState } from 'react';
import { Home } from "./Home.tsx";
import Grid from '@mui/material/Grid2';
import '../styles/App.css'


function App() {
  const [data, setData] = useState(null);
  const [photoUpload, setPhotoUpload] = useState(false);



  useEffect(() => {
    fetch('http://localhost:5001/api')
      .then((response) => response.json())
      .then((data) => setData(data.message));
  }, []);

  return <div ><Grid className='header'>
    <div className='title'>Scene2Song</div>
  </Grid> <Home /> </div >;
}

export default App;
