const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const visits = require('./routes/api/visits')

const app = express();

app.use(bodyParser.json());

app.use('/api/visits', visits);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    app.use(express.static('client/build'));
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

const port = process.env.PORT || 5000;

const listen = () => {
    return app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}

if (process.env.NODE_ENV === 'test') {
    const httpShutdown = require('http-shutdown');
    s = httpShutdown(listen());
    s.host = `http://localhost:${port}`;
}
else {
    s = listen();
}

module.exports = s;