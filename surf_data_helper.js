'use strict';

const request = require('request');
const surf_spots = require('./req_modules/surf_spots');
const checkSurf = require('./req_modules/surfline');
const checkWind = require('./req_modules/wind_sf');
const checkTide = require('./req_modules/tide_sf');

let reqFullReport = {
  whichSpot: function(text_input) {
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

    return this.promFullReport(req_spot_info).then(function(response) {
      return response;
    });
  },
  promFullReport: function(location) {
    return new Promise(function(resolve_full, reject_full) {

      let surf_req = new Promise(function(resolve, reject) {
        request(location.surf_req, function(error, response, html) {
          if (!error && response.statusCode == 200) {
            resolve(checkSurf(html));
          } else {
            reject('Sorry, I\'m having trouble getting the surf report right now.');
          }
        });
      });

      let tide_req = checkTide().then(function(str) {
        return str;
      });

      let wind_req = checkWind().then(function(str) {
        return str;
      });

      Promise.all([surf_req, tide_req, wind_req]).then(function(results) {
        if (results.length === 3) {
          let full_report = `${results[0]} ${results[1]} ${results[2]}`;
          resolve_full(full_report);
        } else {
          reject_full('Sorry, I\'m having trouble getting the surf report right now.');
        }
      });
    });
  }
};

module.exports = reqFullReport;

if (!module.parent) {
  reqFullReport.whichSpot('nowhere').then(function(report) {
    console.log(report);
  }).catch(function(err) {
    console.log(err);
  });
}
