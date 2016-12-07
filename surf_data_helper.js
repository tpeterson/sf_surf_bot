'use strict';

var request = require('request');
var surf_spots = require('./req_modules/surf_spots');
var checkSurf = require('./req_modules/surfline');
var checkWind = require('./req_modules/wind_sf');
var checkTide = require('./req_modules/tide_sf');
//var relayConditions = require('./req_modules/relay_cond');

let reqFullReport = {
  whichSpot: function(text_input) {
    var req_spot = text_input.trim().toLowerCase();

    function checkSpot(name) {
      var spot_info = {};
      surf_spots.forEach(function(spot) {
        if (spot.name === name) {
          spot_info = spot;
        }
      });
      return spot_info;
    }

    var req_spot_info = checkSpot(req_spot);

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

// function SurfDataHelper() {
//   SurfDataHelper.prototype.whichSpot = function(text_input) {
//     var req_spot = text_input.trim().toLowerCase();
//
//     function checkSpot(name) {
//       var spot_info = {};
//       surf_spots.forEach(function(spot) {
//         if (spot.name === name) {
//           spot_info = spot;
//         }
//       });
//       return spot_info;
//     }
//
//     var req_spot_info = checkSpot(req_spot);
//
//     return this.promFullReport(req_spot_info).then(function(response) {
//       return response;
//     });
//   };
//
//   SurfDataHelper.prototype.getFullReport = function(location) {
//     return new Promise(function(resolve, reject) {
//       var surf = {};
//       var tide = {};
//       var wind = {};
//
//       request(location.surf_req, function(error, response, html) {
//         if (!error && response.statusCode == 200) {
//           surf = checkSurf(html);
//
//           if (surf.spot && tide.type && wind.direction) {
//             var full_report = relayConditions(surf, tide, wind);
//             resolve(full_report);
//           }
//         } else {
//           reject('Sorry, I\'m having trouble getting the surf report right now.');
//         }
//       });
//
//       request(location.tide_req, function(error, response, html) {
//         if (!error && response.statusCode == 200) {
//           var data = JSON.parse(response.body);
//           var tides_arr = data.tide.tideSummary;
//
//           tide = checkTide(tides_arr);
//
//           if (surf.spot && tide.type && wind.direction) {
//             var full_report = relayConditions(surf, tide, wind);
//             resolve(full_report);
//           }
//         } else {
//           reject('Sorry, I\'m having trouble getting the surf report right now.');
//         }
//       });
//
//       request(location.wind_req, function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//           wind = checkWind(response.body);
//
//           if (surf.spot && tide.type && wind.direction) {
//             var full_report = relayConditions(surf, tide, wind);
//             resolve(full_report);
//           }
//         } else {
//           reject('Sorry, I\'m having trouble getting the surf report right now.');
//         }
//       });
//     });
//   };
//
//   SurfDataHelper.prototype.promFullReport = function(location) {
//     return new Promise(function(resolve_full, reject_full) {
//
//       let surf_req = new Promise(function(resolve, reject) {
//         request(location.surf_req, function(error, response, html) {
//           if (!error && response.statusCode == 200) {
//             resolve(checkSurf(html));
//           } else {
//             reject('Sorry, I\'m having trouble getting the surf report right now.');
//           }
//         });
//       });
//
//       let tide_req = checkTide().then(function(str) {
//         return str;
//       });
//
//       let wind_req = checkWind().then(function(str) {
//         return str;
//       });
//
//       Promise.all([surf_req, tide_req, wind_req]).then(function(results) {
//         if (results.length === 3) {
//           let full_report = `${results[0]} ${results[1]} ${results[2]}`;
//           resolve_full(full_report);
//         } else {
//           reject_full('Sorry, I\'m having trouble getting the surf report right now.');
//         }
//       });
//     });
//   };
// }
//
// module.exports = SurfDataHelper;
module.exports = reqFullReport;

if (!module.parent) {
  reqFullReport.whichSpot('nowhere').then(function(report) {
    console.log(report);
  }).catch(function(err) {
    console.log(err);
  });
}
