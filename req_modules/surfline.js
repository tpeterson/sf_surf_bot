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

  let wave_desc = $('span#observed-wave-description').text();
  let wave_desc_edit = wave_desc.replace(/\n/g, '');
  wave_desc_edit = wave_desc_edit.match(/\b\w+\s/g, '');
  wave_desc_edit = wave_desc_edit.join('').trim();

  let report_conditions = $('div#observed-spot-conditions').text();
  let report_conditions_edit = report_conditions.split(' ');
  report_conditions_edit = report_conditions_edit[0];

  let report_sum = $('div#observed-spot-conditions-summary p').text();
  let report_sum_edit = report_sum.replace(/\n/g, '');
  report_sum_edit = report_sum_edit.trim();
  let report_sum_arr = report_sum_edit.replace('Afternoon Report for the South Bay: ', '');
  report_sum_arr = report_sum_arr.split('Short-Term');
  let report_sum_now = report_sum_arr[0];
  let report_sum_forecast = report_sum_arr[1].replace(' Forecast for South Bay: ', '');

  let report = {
    spot: spot_name_edit,
    size_num: wave_size_edit,
    size_desc: wave_desc_edit,
    conditions: report_conditions_edit,
    now: report_sum_now,
    forecast: report_sum_forecast
  };

  return report;
}

module.exports = parseReport;
