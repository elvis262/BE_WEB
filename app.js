const express = require('express')
const path = require('path')
const doctorRouter = require('./routes/doctor.js')
const inspectorRouter = require('./routes/inspector')
const loginRouter = require('./routes/connexion')
const doctorAPIRouter = require('./routes/doctorAPI')
const inspectorAPIRouter = require('./routes/inspectorAPI')
const cookieParser = require('cookie-parser')


const app = express();


app.use(cookieParser())
app.use(express.json());
app.use('/photos', express.static('./photos'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})


app.use('/doctor',doctorRouter);
app.use('/inspector',inspectorRouter);
app.use('/connexion',loginRouter);
app.use('/api',doctorAPIRouter)
app.use('/api',inspectorAPIRouter)

module.exports = app;