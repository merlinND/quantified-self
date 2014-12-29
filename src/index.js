'use strict';

var Reporter = require('./reporter.js');

// var reporterFilename = 'reporter-sample.json';
var reporterFilename = 'reporter-2014-12-19.json';
var reporterData = require('../data/' + reporterFilename);

var stats = Reporter.getStats(reporterData);

var start = new Date('2014-06-01');
var end = new Date('2014-06-15');
var snapshots = stats.snapshots.filter(Reporter.filters.byDate(start, end));

console.log(snapshots.length);
// snapshots.map(function(s) { console.log(s.date); });
// Reporter.printMainTokens(stats.questions, 10);
