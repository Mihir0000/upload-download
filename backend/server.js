const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const modalImage = require('./schema/uploadSchema');
const db = require('./connection');

const app = express();

app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '100mb' }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/upload', async (req, res) => {
    // console.log(req);
    const { name, currentChunkIndex, totalChunks, userName, email } = req.query;
    const firstChunks = parseInt(currentChunkIndex) === 0;
    const lastChunks =
        parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
    const data = req.body.toString().split(',')[1];
    const buffer = Buffer.from(data, 'base64');
    if (firstChunks && fs.existsSync('./uploads/' + name)) {
        fs.unlinkSync('./uploads/' + name);
    }
    fs.appendFileSync('./uploads/' + name, buffer);
    // const filter = { imageName: name };
    const currentData = {
        imageName: name,
        userName,
        email,
        currentChunk: currentChunkIndex,
        totalChunks,
        upload_path: `uploads/${name}`,
    };
    if (firstChunks) {
        let isExist = await modalImage.findOne({ imageName: name });
        if (!isExist) {
            try {
                const newImage = await modalImage.create(currentData);
                res.status(200).send({ newImage });
            } catch (error) {
                res.status(500).send(error);
            }
        } else {
            res.send({ message: 'image is exist' });
        }
    } else {
        let doc = await modalImage.findOne({ imageName: name });
        modalImage
            .updateOne({ imageName: name }, { currentChunk: currentChunkIndex })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send(err);
            });
        await doc.save();
    }
});

app.get('/downloads', async (req, res) => {
    const totalData = fs.readdirSync('./uploads/');
    res.send(totalData);
});

app.listen(4000, () => {
    console.log('Server Running on Port 4000');
});
