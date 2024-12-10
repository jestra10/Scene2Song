const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')
const getSongListBasedOnScene = require('./spotify.js')

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
    setTimeout(() => {
        res.json({ success: true, message: 'Upload received!' });
    }, 3000)
});

app.get('/classify', (req, res) => {
    setTimeout(() => {
        res.json({ body: 'Beach' });
    }, 3000)
});

app.get('/songlist', (req, res) => {
    const scene = req.query.scene; // Destructure query parameters
    if (!scene) {
        return res.status(400).json({ error: 'Scene and mood parameters are required' });
    }
    try {
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
