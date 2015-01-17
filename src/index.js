'use strict';

var Reporter = require('./reporter/');

// var reporterFilename = 'reporter-sample.json';
var reporterFilename = 'reporter-2014-12-19.json';
var reporterData = require('../data/' + reporterFilename);

// ----- Filtering
// var start = new Date('2014-07-01 00:00');
// var end = new Date('2014-011-01 00:00');
var snapshots = reporterData.snapshots.filter(Reporter.filters.wasTriggeredBy(Reporter.reasons.RANDOM));
// var snapshots = reporterData.snapshots.filter(Reporter.filters.byMonth(6));
// var snapshots = reporterData.snapshots.filter(Reporter.filters.hasSpeed(0.1));

// ----- Grouping
// var grouped = Reporter.groupBy.year(reporterData.snapshots);
// var snapshots = grouped.asList();

// ----- Display
console.log('Loaded `' + reporterFilename + '`.');
console.log('Total available snapshots: ' + reporterData.snapshots.length + '\n');

// console.log('Recovering flat list: ' + grouped.asFlatList().length);
// console.log(Object.keys(grouped).map(function(group) { return group; }));
// snapshots.map(Reporter.loggers.place);

// ----- Basic analaysis
// TODO: support grouped data
// var data = {
//   snapshots: snapshots,
//   questions: reporterData.questions
// };
var stats = Reporter.getStats(reporterData);
Reporter.printMainTokens(stats.questions, 10);
