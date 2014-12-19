'use strict';

var reporter = require('./reporter.js');
var reporterData = require('../data/reporter-sample.json');

var stats = reporter.getStats(reporterData);

console.log(stats);
