'use strict';
/*
 * @file Support for [Reporter.app](http://www.reporter-app.com/) data
 * Expected format: JSON
 */

var getTopTokens = require('./get-top-tokens.js');

/**
 * Go through each question and print the most common tokens
 * @param `question` The questions object, as prepared by `extractTokens`
 * @param `n` Number of tokens to print at most. Defaults to -1 (no limit).
 */
var printMainTokens = function(questions, n) {
  var validQuestions = questions.filter(function(q) { return q.tokens; });
  validQuestions.forEach(function(q) {
    console.log(q.prompt);

    var topTokens = getTopTokens(q, n);

    for(var i = 0; i < topTokens.length; i += 1) {
      var t = topTokens[i];
      var count = q.tokens[t];
      var proportion = (count / q.occurrences) * 100;

      var spaces = ' ';
      if(proportion < 100) {
        spaces += ' ';
      }
      if(proportion < 10) {
        spaces += ' ';
      }

      console.log(spaces + proportion.toFixed(1) + '% | ' +
        t + ' (' + count + ')');
    }
    console.log();
  });
};


 module.exports = {
  getStats: require('./getStats.js'),
  printMainTokens: printMainTokens,
  filters: require('./filters.js'),
  groupBy: require('./groupBy.js'),
  reasons: require('./reasons.js'),
  questionTypes: require('./questionTypes.js'),
  anonymize: require('./anonymize.js'),
  loggers: require('./loggers.js')
};
