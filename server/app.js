const express = require('express');

const app = express();

//when app runs, callback function runs
app.listen(4000,() => {
    console.log('now listening for requests on port 4000');
});