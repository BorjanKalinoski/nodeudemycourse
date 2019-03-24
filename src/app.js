const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

//paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsDirPath = path.join(__dirname, '../templates/views');
const partialsDirPath = path.join(__dirname, '../templates/partials');
//Setup handlebars engine and views location
hbs.registerPartials(partialsDirPath);

app.set('view engine', 'hbs');
app.set('views', viewsDirPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
    res.render('index',{
        title:'Index page'
    });//vo views folder
});
app.get('/about', (req, res) => {
    res.render('about', {
        title:'About page',
        text:'This is text for about page',
        header:'ABOUT ME'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title:'Help me',
        text: 'Imma change this help page'
    });
});
app.get('/help/*', (req, res) => {
    res.render('notfound', {
        error: 'Opps Help Article not found!'
    });
});
app.get('/weather', (req, res) => {
    const {address} = req.query;
    if(!address){
        return res.send({
            error: 'You must provide an address!'
        });
    }
    geocode(address, (error, geoData) => {
        if (error) {
            return res.send({
                error
            });
        }
        const {latitude,longitude,location}=geoData;
        forecast({latitude, longitude}, (error, forecastData) => {
            if (error) {
                res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address
            });
        });
    });
});
app.get('*', (req, res) => {
    res.render('notfound', {
        error: 'Opps Page not found!'
    });
});
app.listen(3000, () => {
    console.log('Listening on port 30000');
});