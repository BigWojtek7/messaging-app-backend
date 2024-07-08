require('dotenv').config();
const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const logger = require('morgan');

// const isAuth = require('./config/isAuth');

const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

const cors = require('cors');

const passport = require('passport');
const mongoose = require('mongoose');


mongoose.connect(
  'mongodb+srv://wojtasjg:lSwWOPNyGAVV32eM@cluster0.lahxsgw.mongodb.net/messaging_app?retryWrites=true&w=majority&appName=Cluster0'
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();


app.use(cors());

require('./config/passport')(passport);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));






app.use('/', usersRouter);
app.use('/', messagesRouter);

module.exports = app;
