const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const { connectDataBase } = require('./config/connectDatabase');
const contributorRouter = require('./router/contributorsRouter');
const authRoutes = require('./router/auth');
const cors = require('cors');
const worksRouter = require('./router/worksRouter');
dotenv.config({path: path.join(__dirname, 'config', 'config.env')});

connectDataBase();

app.use(cors({
  origin: '*', // or specify your frontend origin like 'http://localhost:4200'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/v1', contributorRouter);
// works
app.use('/api/v1', worksRouter);


app.listen(4000, () => {
    console.log('Server start');
})