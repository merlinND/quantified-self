'use strict';

/**
 * Extract the `n` most common answers to a given question
 *
 * @param `question` The questions object, as prepared by `extractTokens`
 * @param [`n`] Number of tokens to print at most. Defaults to -1 (no limit).
 * @param `addOtherCount` Add an 'Other' token counting the ommitted entries
 */
module.exports = function getTopTokens(question, n, addOtherCount) {
  n = n || -1;
  addOtherCount = addOtherCount || false;

  var sortByCount = function(a, b) {
    return question.tokens[a] - question.tokens[b];
  };
  var sortByCountReverse = function(a, b) {
    return - sortByCount(a, b);
  };
  var firstN = function(n) {
    if(n < 0) {
      return function() {
        return true;
      };
    }

    return function(element, i) {
      return (i < n);
    };
  };

  var topTokens = {};
  var keys = Object.keys(question.tokens).sort(sortByCountReverse).filter(firstN(n));
  keys.forEach(function(t) {
    topTokens[t] = question.tokens[t];
  });

  if(addOtherCount) {
    var total = 0;
    Object.keys(question.tokens).forEach(function(t) { total += question.tokens[t]; });
    var sub = 0;
    keys.forEach(function(t) { sub += question.tokens[t]; });

    // TODO: what if the key 'Other' is already used?
    if(total - sub > 0) {
      topTokens['Other'] = total - sub;
    }
  }

  return topTokens;
};
