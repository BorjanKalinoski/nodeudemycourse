const request = require('request');

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?&access_token=pk.eyJ1IjoiZHJzbXJ0bmlrIiwiYSI6ImNqdGhoNnVycjB2MTc0M3BkZTY3ZjFzeWsifQ.0kCRm55YjInGjFX2jEKhEg`;
        request({url: url,json:true}, (error, data) => {
            if(error){
                console.log('error fetching geocoding data', error);
                callback(error, undefined);
            }else if(data.body.features.length===0){
                callback('Please provide a valid address', undefined);
            }else{
                callback(undefined, {
                    latitude:data.body.features[0].center[0],
                    longitude: data.body.features[0].center[1],
                    location: data.body.features[0].place_name
                });
            }
        });
};

module.exports = geocode;