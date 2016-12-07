const https = require("https");
const querystring = require('querystring');

function getTide() {
  let endpoint = '/api/datagetter'

  let q = querystring.stringify({
    station: '9414290',
    date: 'recent',
    product: 'water_level',
    datum: 'mllw',
    units: 'english',
    time_zone: 'lst',
    format: 'json',
    application: 'TIM'
  });

  let options = {
    method: 'GET',
    hostname: 'tidesandcurrents.noaa.gov',
    path: `/api/datagetter?${q}`
  };

  return new Promise(function(resolve, reject) {
    reqTide(options, resolve, reject);
  });
}

function reqTide(link, cb, cb_err) {
  let req = https.request(link, function(res) {
    let data = new Buffer(0);

    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      let info = JSON.parse(data.toString());
      let results = info.data;
      let latest = results[results.length - 1];
      let next_latest = results[results.length - 5];

      if (latest.v > next_latest.v) {
        cb(`The tide is coming up and just hit ${latest.v.slice(0,4)} feet.`);
      } else {
        cb(`The tide is dropping out and just hit ${latest.v.slice(0,4)} feet.`);
      }
    });
  });

  req.on('error', function(e) {
    cb_err('Sorry, I\'m having trouble getting the surf report right now.');
  });

  req.end();
}

module.exports = getTide;
