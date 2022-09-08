const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    currentChunk: {
        type: Number,
        required: true,
    },
    totalChunks: {
        type: Number,
        required: true,
    },
    upload_path: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer,
        contentType: String,
    },
});

const modalImage = mongoose.model('Images', uploadSchema);
module.exports = modalImage;
