const mongoose = require('mongoose');

const db = process.env.MONGO_URI || require('../config/keys').mongoURI;

mongoose
    .connect(db,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.log(err));

module.exports = mongoose;