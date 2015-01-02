'use strict';

var Reporter = require('./reporter.js');

// var reporterFilename = 'reporter-sample.json';
var reporterFilename = 'reporter-2014-12-19.json';
var reporterData = require('../data/' + reporterFilename);

// ----- Filtering
// var start = new Date('2014-07-01 00:00');
// var end = new Date('2014-011-01 00:00');
var snapshots = reporterData.snapshots.filter(Reporter.filters.byMonth(6));

// ----- Display
console.log(snapshots.length);
// var logger = function(s) {
//   console.log(new Date(s.date));
// };
// snapshots.map(logger);

// ----- Basic analaysis
var data = {
  snapshots: snapshots,
  questions: reporterData.questions
};
var stats = Reporter.getStats(data);
Reporter.printMainTokens(stats.questions, 10);
