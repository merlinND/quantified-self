$(function () {
  'use strict';

  // TODO: use Browserify to build app
  var drawExampleChart = require('./drawExampleChart.js');
  var handleFileInput = require('./handleFileInput.js');

  var Reporter = require('../../src/reporter');

  console.log(Reporter);

  $(document).ready(function() {
    // TODO: check for HTML5 File APIs support

    $('#file-input').on('change', handleFileInput);
    drawExampleChart($('#graph-container'));
  });
});
