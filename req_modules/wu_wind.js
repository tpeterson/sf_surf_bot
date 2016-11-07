'use strict';

function parseWind(response_body) {
  let data = JSON.parse(response_body);
  let cond = data.current_observation;

  function WindObj(conditions) {
    let that = {
      low: conditions.wind_mph,
      high: conditions.wind_gust_mph,
      direction: conditions.wind_dir,
      angle: conditions.wind_degrees,
      isCalm: conditions.wind_string.trim() === 'Calm' ? true : false
    };
    return that;
  }

  let wind_info = new WindObj(cond);
  return wind_info;
}

module.exports = parseWind;
