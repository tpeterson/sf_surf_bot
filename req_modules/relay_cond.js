'use strict';

function relayConditions(surf, tide, wind) {
  let surf_report = `The waves at ${surf.spot} are ${surf.size_num} and ${surf.conditions}.`;
  let wind_report = wind.isCalm ? 'The winds are supposedly calm.' : `The winds are ${wind.direction.includes('W') ? 'onshore' : 'offshore'} at ${wind.low} to ${wind.high} miles per hour.`;
  let tide_report = `And it looks like the tide is ${tide.type === 'high' ? 'coming up' : 'dropping out'}. The next tide will hit ${tide.height} at ${tide.time}.`

  let full_report = `${surf_report} ${wind_report} ${tide_report}`;

  return full_report;
};

module.exports = relayConditions;
