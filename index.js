const PORT = process.env.PORT ||  8080;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { filter } = require('domutils');

const app = express();

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/',
        base: 'https://www.thetimes.co.uk/',
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/',
        base: 'https://www.theguardian.com/',
    },
    {
        name: 'thetelegraph',
        address: 'https://www.telegraph.co.uk/us/',
        base: 'https://www.telegraph.co.uk/',
    },
    {
        name: 'thesun',
        address: 'https://www.the-sun.com/',
        base: 'https://www.the-sun.com/',
    },
    {
        name: 'chicagotribune',
        address: 'https://www.chicagotribune.com/',
        base: 'https://www.chicagotribune.com/',
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/',
        base: 'https://www.nytimes.com/',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/',
        base: 'https://www.bbc.com/',
    },
    {
        name: 'cnn',
        address: 'https://www.cnn.com/',
        base: 'https://www.cnn.com/',
    },


    
]
const articles = [];

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("Gaza")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })

            })
        })
})


app.get('/', (req, res) => {
    res.send("Hello users. This is my API")
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId;
    const matchingNewspaper = newspapers.find(newspaper => newspaper.name === newspaperId);

    if (matchingNewspaper) {
        const newspaperURL = matchingNewspaper.address;
        const newspaperBase = matchingNewspaper.base;
        axios.get(newspaperURL)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const filteredArticles = []
            $('a:contains("Gaza")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                filteredArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(filteredArticles)
            console.log(filteredArticles)

        }).catch(err => console.log(err))

    }
    else{
        res.send('News not found');
    };
    //const newspaperBase = newspapers.find(newspaper => newspaper.name == newspaperId)[0].base;

})

app.listen(PORT, () => console.log(`Server running on ${PORT}`));