const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const visits = require('./routes/api/visits')

const app = express();

app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.log(err));

app.use('/api/visits', visits);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}.`))

