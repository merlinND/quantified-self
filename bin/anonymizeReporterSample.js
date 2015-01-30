'use strict';
/**
 * @file This script saves an anonymized version of sample data.
 */

// TODO: also anonymize places & other sensitive info

var rawFilename = 'reporter-sample-raw.json';
var anonymizedFilename = 'reporter-sample.json';

var fs = require('fs');
var Reporter = require('../src/reporter/');
var reporterSample = require('../data/' + rawFilename);

Reporter.anonymize(reporterSample.snapshots, reporterSample.questions);

var output = JSON.stringify(reporterSample, null, 2);
fs.writeFile('../data/' + anonymizedFilename, output);
console.log('Anonymized sample data written to data/' + anonymizedFilename);
