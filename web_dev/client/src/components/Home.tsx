import React, { useEffect, useState } from 'react';

export function Home() {
    const [data, setData] = useState(null);
    const [img, setImg] = useState<File>();
    const upload = async () => {
        if (!img) {
            console.error('No file selected.');
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
            console.log('Upload successful:', result);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }

    return <div className='homePage'>
        <input type="file" onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
                setImg(e.target.files[0]);
            }
        }} />
        <button onClick={upload}>Upload</button></div>;
}
