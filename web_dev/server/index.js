const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')
const { getSongListBasedOnScene, getCredentials } = require('./spotify.js')
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from Node.js server!');
});

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./images")
    },
    filename: function (req, file, cb) {
        return cb(null, file.originalname)
    }
});

const uploadImg = multer({ storage })

app.post('/upload', uploadImg.single('file'), (req, res) => {
    console.log(req.body)
    console.log(req.file)
    const filePath = req.file.path;
    const fullFilePath = path.resolve(filePath);
    setTimeout(() => {
        res.json({ success: true, message: 'Upload received!', file: fullFilePath });
    }, 3000)
});

app.get('/classify', async (req, res) => {
    setTimeout(async () => {
        const { filepath, diversity, list_len } = req.query;
        const response = await axios.get(`http://localhost:5004/classify?filepath=${filepath}&diversity=${diversity}&list_len=${list_len}`);
        const result = await response.data;
        res.json({ songs: result.songs, scenes: result.scenes });
    }, 3000)
});

app.get('/songlist', (req, res) => {
    const scene = req.query.scene; // Destructure query parameters
    if (!scene) {
        return res.status(400).json({ error: 'Scene parameters are required' });
    }
    try {
        getCredentials()
        setTimeout(() => {
            const songList = getSongListBasedOnScene(scene);
            res.json({
                body: songList
            });
        }, 3000)
    } catch (error) {
        console.error('Error fetching song list:', error); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
