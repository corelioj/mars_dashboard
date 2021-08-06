require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000





app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async(req, res) => {
    try {
        let apod = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ apod })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/roversInfo/:rover', async(req, res) => {
    try {
        const rover = req.params.rover.toLowerCase();
        const imagesRover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)

        .then(res => res.json())
        res.send({ imagesRover })
        console.log('teste rover:', imagesRover);
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))