const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { MongoClient } = require('mongodb');

const quotesRouter = require('./routes/quotes');

const app = express();

// MongoDB connection URI
const uri = 'mongodb+srv://root:root@telusko.rb3lafm.mongodb.net/HomeScreen';

// Connect to MongoDB and store the connection in app.locals
const client = new MongoClient(uri);
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        app.locals.db = client.db('HomeScreen'); // Specify the database name here app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use('/', quotesRouter);
        module.exports = app;
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the application if MongoDB connection fails
    });