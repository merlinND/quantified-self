'use strict';
/*
 * @file Support for [Reporter.app](http://www.reporter-app.com/) data
 * Expected format: JSON
 */

/**
 * For each question, extract all tokens (and their count)
 * Augment `questions` with the `tokens` (token => count) object
 */
var extractTokens = function(snapshots, questions) {

  questions.forEach(function(q, i) {
    if(q.questionType !== 0) {
      // TODO: support other kind of question types
      return;
    }

    questions[i].tokens = {};
    var question = q.prompt;

    snapshots.forEach(function(s) {
      s.responses.forEach(function(r) {
        if(r.questionPrompt === question && r.tokens) {
          var tokens = r.tokens.map(function(t) { return t.text; });
          tokens.forEach(function(t) {
            if(!questions[i].tokens[t]) {
              questions[i].tokens[t] = 0;
            }
            questions[i].tokens[t] += 1;
          });
        }
      });
    });
  });
};


/**
 * Get simple stats (number of entries, etc)
 */
var getStats = function(data) {
  var snapshots = data.snapshots;
  var questions = data.questions;
  extractTokens(snapshots, questions);

  var stats = {
    entryCount: snapshots.length,
    questions: questions
  };

  return stats;
};

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
      console.log('  ' + t + ' (' + q.tokens[t] + ')');
    }
  });
};

module.exports = {
  getStats: getStats,
  printMainTokens: printMainTokens
};
