import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Props {
    clicked: boolean;
    setClicked: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}
export function Home(props: Props) {
    const [data, setData] = useState(null);
    const [img, setImg] = useState<File>();
    const upload = async () => {
        props.setClicked(true); //change the page
        props.setLoading(true)
        if (!img) {
            console.error('No file selected.');
            props.setClicked(false);
            props.setLoading(false);
            return;

        }
        const formData = new FormData()
        formData.append('file', img)
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
        <input type="file" onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
                setImg(e.target.files[0]);
            }
        }} />
        <button onClick={upload}>Upload Image</button></div>;
}
