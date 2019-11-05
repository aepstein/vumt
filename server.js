const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/visits', require('./routes/api/visits'));

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