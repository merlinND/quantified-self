'use strict';

var reporter = require('./reporter.js');

// var reporterFilename = 'reporter-sample.json';
var reporterFilename = 'reporter-2014-12-19.json';
var reporterData = require('../data/' + reporterFilename);

var stats = reporter.getStats(reporterData);

// console.log(stats);
reporter.printMainTokens(stats.questions, 10);
