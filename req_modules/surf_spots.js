'use strict';

const surf_spots = [
  {
    name: 'mavericks',
    surf_req: 'http://www.surfline.com/surf-report/mavericks-northern-california_4152/',
    tide_req: 'http://api.wunderground.com/api/ff0c6fa2dcdd7a66/tide/q/CA/Half_Moon_Bay.json',
    wind_req: 'http://api.wunderground.com/api/ff0c6fa2dcdd7a66/conditions/q/CA/Half_Moon_Bay.json'
  },
  {
    name: 'ocean beach',
    surf_req: 'http://www.surfline.com/surf-report/ocean-beach-sf-northern-california_4127/',
    tide_req: 'http://api.wunderground.com/api/ff0c6fa2dcdd7a66/tide/q/CA/San_Francisco.json',
    wind_req: 'http://api.wunderground.com/api/ff0c6fa2dcdd7a66/conditions/q/CA/San_Francisco.json'
  },
  {
    name: 'pacifica',
    surf_req: 'http://www.surfline.com/surf-report/pacifica-lindamar-northern-california_5013/',
    tide_req: 'http://api.wunderground.com/api/ff0c6fa2dcdd7a66/tide/q/CA/Pacifica.json',
    wind_req: 'http://api.wunderground.com/api/ff0c6fa2dcdd7a66/conditions/q/CA/Pacifica.json'
  }
];

module.exports = surf_spots;
