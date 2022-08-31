import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import md5 from 'md5';

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
    const ext = name.split('.').pop();
    const data = req.body.toString().split(',')[1];
    const buffer = new Buffer(data, 'base64');
    const tempFileName = md5(name + req.ip) + '.' + ext;
    if (firstChunks && fs.existsSync('./uploads/' + tempFileName)) {
        fs.unlinkSync('./uploads/' + tempFileName);
    }
    fs.appendFileSync('./uploads/' + tempFileName, buffer);
    if (lastChunks) {
        const finalFileName = md5(Date.now()).substr(0, 10) + '.' + ext;
        fs.renameSync(
            './uploads/' + tempFileName,
            './uploads/' + finalFileName
        );
        res.json({ finalFileName });
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
