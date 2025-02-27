const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { MongoClient } = require('mongodb');
const app = express();
const server = require("http").createServer(app);
const quotesRouter = require('./routes/quotes');
const PORT = process.env.PORT || 3030;
// MongoDB connection URI
const uri = 'mongodb+srv://dreamercloudofficial:dreamercloudofficial@rooms.drpj12s.mongodb.net/?retryWrites=true&w=majority&appName=Rooms';
// Connect to MongoDB and store the connection in app.locals
const client = new MongoClient(uri);
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        app.locals.db = client.db('test');

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
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});