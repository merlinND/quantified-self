'use strict';

var Reporter = require('./reporter.js');

// var reporterFilename = 'reporter-sample.json';
var reporterFilename = 'reporter-2014-12-19.json';
var reporterData = require('../data/' + reporterFilename);

var stats = Reporter.getStats(reporterData);

var snapshots = stats.snapshots.filter(Reporter.filters.wasTriggeredBy(Reporter.reasons.SLEEP));

console.log(snapshots.length);
// Reporter.printMainTokens(stats.questions, 10);
