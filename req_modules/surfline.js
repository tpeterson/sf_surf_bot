'use strict';

const cheerio = require('cheerio');

function parseReport(page) {
  let $ = cheerio.load(page);

  let spot_name = $('title').text();
  let spot_name_edit = spot_name.split('-');
  spot_name_edit = spot_name_edit[0].trim();

  let wave_size = $('h2#observed-wave-range').text();
  let wave_size_edit = wave_size.replace(/m/g, 'ft');
  wave_size_edit = wave_size_edit.replace(/.0/g, '');
  wave_size_edit = wave_size_edit.replace(/\s/g, '');

  let report_conditions = $('div#observed-spot-conditions').text();
  let report_conditions_edit = report_conditions.split(' ');
  report_conditions_edit = report_conditions_edit[0];

  let report = {
    spot: spot_name_edit,
    size_num: wave_size_edit,
    conditions: report_conditions_edit
  };

  return report;
}

module.exports = parseReport;
