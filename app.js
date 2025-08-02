const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const { connectDataBase } = require('./config/connectDatabase');
const contributorRouter = require('./router/contributorsRouter');
dotenv.config({path: path.join(__dirname, 'config', 'config.env')});

connectDataBase();

app.use(express.json())

app.use('/api/v1', contributorRouter);

app.listen(4000, () => {
    console.log('Server start');
})