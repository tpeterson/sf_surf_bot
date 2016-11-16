'use strict';

const request = require('request');
const surf_spots = require('./req_modules/surf_spots');
const checkSurf = require('./req_modules/surfline');
const checkWind = require('./req_modules/wu_wind');
const checkTide = require('./req_modules/wu_tide');
const relayConditions = require('./req_modules/relay_cond');

function SurfDataHelper() {
  SurfDataHelper.prototype.whichSpot = function(text_input) {
    let req_spot = text_input.trim().toLowerCase();

    function checkSpot(name) {
      let spot_info = {};
      surf_spots.forEach(function(spot) {
        if (spot.name === name) {
          spot_info = spot;
        }
      });
      return spot_info;
    }

    let req_spot_info = checkSpot(req_spot);

    return this.getFullReport(req_spot_info).then(function(response) {
      return response;
    });
  };

  SurfDataHelper.prototype.getFullReport = function(location) {
    return new Promise(function(resolve, reject) {
      let surf = {};
      let tide = {};
      let wind = {};

      request(location.surf_req, function(error, response, html) {
        if (!error && response.statusCode == 200) {
          surf = checkSurf(html);

          if (surf.spot && tide.type && wind.direction) {
            resolve(relayConditions(surf, tide, wind));
          }
        }
      });

      request(location.tide_req, function(error, response, html) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(response.body);
          let tides_arr = data.tide.tideSummary;

          tide = checkTide(tides_arr);

          if (surf.spot && tide.type && wind.direction) {
            resolve(relayConditions(surf, tide, wind));
          }
        }
      });

      request(location.wind_req, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          wind = checkWind(response.body);

          if (surf.spot && tide.type && wind.direction) {
            resolve(relayConditions(surf, tide, wind));
          }
        }
      });
    });
  };

  SurfDataHelper.prototype.promFullReport = function(location) {
    return new Promise(function(resolve_full, reject_full) {
      let surf_req = new Promise(function(resolve, reject) {
        request(location.surf_req, function(error, response, html) {
          if (!error && response.statusCode == 200) {
            resolve(checkSurf(html));
          }
        });
      });

      let tide_req = new Promise(function(resolve, reject) {
        request(location.tide_req, function(error, response, html) {
          if (!error && response.statusCode == 200) {
            let data = JSON.parse(response.body);
            let tides_arr = data.tide.tideSummary;

            resolve(checkTide(tides_arr));
          }
        });
      });

      let wind_req = new Promise(function(resolve, reject) {
        request(location.wind_req, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(checkWind(response.body));
          }
        });
      });

      Promise.all([surf_req, tide_req, wind_req]).then(function(results) {
        resolve_full(relayConditions(results[0], results[1], results[2]));
      });
    });
  };
}

module.exports = SurfDataHelper;
