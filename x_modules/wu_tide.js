'use strict';

function parseTides(tides_data) {
  let high_tides = [];
  let low_tides = [];

  tides_data.forEach(function(entry) {
    if (entry.data.type === 'High Tide') {
      high_tides.push(entry);
    } else if (entry.data.type === 'Low Tide') {
      low_tides.push(entry);
    }
  });

  function TideObj(tide, type) {
    let that = {};
    that.height = tide.data.height;
    that.type = type;
    that.time = parseTime(tide.date);
    that.epoch = parseInt(tide.date.epoch);
    return that;
  }

  function parseTime(tide) {
    var tide_time = tide.pretty;
    let time = tide_time.includes('PDT') ? tide_time.split('PDT') : tide_time.split('PST');
    return time[0].trim();
  }

  var tide_high = new TideObj(high_tides[0], 'high');
  var tide_low = new TideObj(low_tides[0], 'low');

  if (tide_high.epoch < tide_low.epoch) {
    return tide_high;
  } else {
    return tide_low;
  }
}

module.exports = parseTides;
