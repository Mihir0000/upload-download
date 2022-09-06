const mongoose = require('mongoose');
require('dotenv').config();
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const uri = `mongodb+srv://Mihir:${process.env.MONGO_PASS}@cluster0.6iqredv.mongodb.net/myImages?retryWrites=true&w=majority`;

const connection = mongoose
    .connect(uri, connectionParams)
    .then(() => console.log('MongoDB Connected !'))
    .catch((err) => console.log(err));

module.exports = connection;
