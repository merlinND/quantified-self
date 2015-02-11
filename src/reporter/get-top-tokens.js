'use strict';

/**
 * Extract the `n` most common answers to a given question
 *
 * @param `question` The questions object, as prepared by `extractTokens`
 * @param [`n`] Number of tokens to print at most. Defaults to -1 (no limit).
 */
module.exports = function getTopTokens(question, n) {
  n = n || -1;

  var sortByCount = function(a, b) {
    return question.tokens[a] - question.tokens[b];
  };
  var sortByCountReverse = function(a, b) {
    return - sortByCount(a, b);
  }
  var firstN = function(n) {
    if(n < 0) {
      return function() {
        return true;
      }
    }

    return function(element, i) {
      return (i < n);
    };
  }

  return Object.keys(question.tokens).sort(sortByCountReverse).filter(firstN);
}
