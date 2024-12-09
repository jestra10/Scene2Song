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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
