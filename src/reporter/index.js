'use strict';
/*
 * @file Support for [Reporter.app](http://www.reporter-app.com/) data
 * Expected format: JSON
 */

/**
 * Go through each question and print the most common tokens
 * @param `question` The questions object, as prepared by `extractTokens`
 * @param `n` Number of tokens to print at most
 */
var printMainTokens = function(questions, n) {
  n = n || -1;

  var validQuestions = questions.filter(function(q) { return q.tokens; });
  validQuestions.forEach(function(q) {
    console.log(q.prompt);

    var sortByCount = function(a, b) {
      return q.tokens[a] - q.tokens[b];
    };
    var tokens = Object.keys(q.tokens).sort(sortByCount);

    for(var i = tokens.length - 1; i >= 0 && i > (tokens.length - n); i -= 1) {
      var t = tokens[i];
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
  loggers: require('./loggers.js')
};
