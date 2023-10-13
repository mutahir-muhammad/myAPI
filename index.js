const PORT = 8080;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { filter } = require('domutils');

const app = express();

const newspapers = [
    {
        name: 'theTimes',
        address: 'https://www.thetimes.co.uk/',
        base: 'https://www.thetimes.co.uk/',
    },
    {
        name: 'TheGuardian',
        address: 'https://www.theguardian.com/',
        base: 'https://www.theguardian.com/',
    },
    {
        name: 'theTelegraph',
        address: 'https://www.telegraph.co.uk/us/',
        base: 'https://www.telegraph.co.uk/',
    }
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

// app.get('/news/:newspaperId', async(req, res) => {
//     const newspaperId = req.params.newspaperId;
//     const newspaperURL = newspapers.filter(newspaper => newspaper.name == newspaperId)[0];
//     const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0];



//     axios.get(newspaperURL)
//     .then(response => {
//         const html = response.data
//         const $ = cheerio.load(html)
//         const filteredArticles = []
//         $('a:contains("climate")', html).each(function(){
//             const title = $(this).text()
//             const url = $(this).attr('href')
//             filteredArticles.push({
//                 title,
//                 url: newspaperBase + url,
//                 source: newspaperId
//             })
//         })
//         res.json(filteredArticles)

//     }).catch(err => console.log(err))

// })

app.listen(PORT, () => console.log(`Server running on ${PORT}`));