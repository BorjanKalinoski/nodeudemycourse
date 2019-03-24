const request = require('request');
console.log('Da probame neso');
const forecast = ({latitude, longitude}, callback) => {
    const url = `https://api.darksky.net/forecast/27f351d61f5eccd267bd816dcd6af2cc/${latitude},${longitude}`;
    request({url: url,json:true}, (error, data) => {
        if (error) {
            callback(error,undefined);
        } else if(data.code===400){
            callback('The given location is invalid', undefined);
        }else{
            callback(undefined, {
                temperature: data.body.currently.temperature,
                humidity: data.body.currently.humidity,
                summary: data.body.currently.summary
            });
        }
    });
};
module.exports = forecast;