const PORT = 8080;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.get('/', (req, res) => {
    res.send("Hello users. This is my API")
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`));