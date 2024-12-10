const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')

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
    res.json({ success: true, message: 'Upload received!' });
});

app.get('/classify', (req, res) => {
    res.json({ body: 'Beach' });
});

app.get('/songlist', (req, res) => {
    const scene = req.query.scene; // Destructure query parameters
    if (!scene) {
        return res.status(400).json({ error: 'Scene and mood parameters are required' });
    }
    try {
        res.json({
            body: [
                { title: "Song 1", artist: "Artist 1", url: "https://example.com/song1" },
                { title: "Song 2", artist: "Artist 2", url: "https://example.com/song2" },
                { title: "Song 3", artist: "Artist 3", url: "https://example.com/song3" }
            ]
        });
    } catch (error) {
        console.error('Error fetching song list:', error); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
