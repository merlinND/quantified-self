'use strict';

var Reporter = require('./reporter.js');

// var reporterFilename = 'reporter-sample.json';
var reporterFilename = 'reporter-2014-12-19.json';
var reporterData = require('../data/' + reporterFilename);

var stats = Reporter.getStats(reporterData);

var start = new Date('2014-07-01 00:00');
var end = new Date('2014-011-01 00:00');
var snapshots = stats.snapshots.filter(Reporter.filters.byDay(start));

console.log(snapshots.length);

var logger = function(s) {
  console.log(new Date(s.date));
};
snapshots.map(logger);

// Reporter.printMainTokens(stats.questions, 10);
