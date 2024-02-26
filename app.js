const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { MongoClient } = require('mongodb');

// const indexRouter = require('./routes/index');
const quotesRouter = require('./routes/quotes');

const app = express();

// MongoDB connection URI
const uri = 'mongodb+srv://root:root@telusko.rb3lafm.mongodb.net/';

// Connect to MongoDB and store the connection in app.locals
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        app.locals.db = client.db('HomeScreen');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/quotes', quotesRouter);

module.exports = app;
