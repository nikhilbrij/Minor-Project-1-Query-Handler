const mongoose = require('mongoose');

//Database Connectivity
mongoose
    .connect('mongodb://127.0.0.1:27017/Query-Handler', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected Succesfully!'))
    .catch(err => {
        console.log('Unable to connect Database ' + err);
    });