const express = require("express");
const app = express();

app.get('/', (req, res) => {
    res.send('Succesful response.')
})

const port = 8081;

app.listen(port);