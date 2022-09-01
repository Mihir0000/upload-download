import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();

app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '100mb' }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/uploads', express.static('uploads'));

app.post('/upload', (req, res) => {
    const { name, currentChunkIndex, totalChunks } = req.query;
    // console.log(name);
    const firstChunks = parseInt(currentChunkIndex) === 0;
    const lastChunks =
        parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
    const data = req.body.toString().split(',')[1];
    const buffer = new Buffer(data, 'base64');
    if (firstChunks && fs.existsSync('./uploads/' + name)) {
        fs.unlinkSync('./uploads/' + name);
    }
    fs.appendFileSync('./uploads/' + name, buffer);
    if (lastChunks) {
        res.json({ name });
    } else {
        res.json('ok');
    }
});

app.get('/downloads', (req, res) => {
    const totalData = fs.readdirSync('./uploads/');
    res.send(totalData);
});

app.listen(4000, () => {
    console.log('Server Running on Port 4000');
});
