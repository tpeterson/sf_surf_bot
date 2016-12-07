const https = require("https");
const querystring = require('querystring');

function getWind() {
  let endpoint = '/api/datagetter'

  let q = querystring.stringify({
    station: '9414290',
    date: 'recent',
    product: 'wind',
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
    reqWind(options, resolve, reject);
  });
}

function reqWind(req_url, cb, cb_err) {
  let req = https.request(req_url, function(res) {
    let data = new Buffer(0);

    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      let info = JSON.parse(data.toString());
      let results = info.data;
      let wind_entry = results[results.length - 1];
      let wind_response = processWindData(wind_entry);
      cb(wind_response);
    });
  });

  req.on('error', function(e) {
    cb_err('Sorry, I\'m having trouble getting the surf report right now.');
  });

  req.end();
}

function processWindData(wind_res) {
  if (wind_res.length !== 0) {
    let wind_speed_raw = (wind_res.s * 1.15078).toString();
    let wind_speed = wind_speed_raw.split('.');
    wind_speed[1] = wind_speed[1].slice(0, 2);
    let wind_speed_str = wind_speed.join('.');
    let wind_direction = wind_res.dr;
    let wind_direction_str = wind_direction.includes('W') ? 'onshore' : 'offshore';
    let isCalm = false;

    return `The winds are ${wind_direction_str} at ${wind_speed_str} miles per hour.`;
  } else {
    let wind_speed_str = '0';
    let wind_direction_str = '';
    let isCalm = true;

    return 'The winds are calm.';
  }
}

module.exports = getWind;
