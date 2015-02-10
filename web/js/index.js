$(function () {
  'use strict';

  var drawExampleChart = require('./drawExampleChart.js');
  var drawReporterCharts = require('./drawReporterCharts.js');
  var handleFileInput = require('./handleFileInput.js');

  var sampleData;
  try {
    sampleData = require('../../data/reporter-sample.json');
  } catch(e) {
    console.log('Sample data file not found.');
  }


  $(document).ready(function() {
    // TODO: check for HTML5 File APIs support
    $('#file-input').on('change', handleFileInput);

    if(sampleData) {
      drawReporterCharts(sampleData, $('#reporter-charts'));
    }
    else {
      // Placeholder chart
      drawExampleChart($('#reporter-charts'));
    }
  });
});
