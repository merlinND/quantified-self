'use strict';

var questionTypes = require('./questionTypes.js');

/**
 * For each question, extract all tokens (and their count)
 * Augment `questions` with the `tokens` (token => count) object
 */
var extractTokens = function(snapshots, questions) {
  /**
   * Each kind of questions has a different
   * way of representing answers
   */
  var extractors = {};
  /**
   * Token-based answer (multiple tokens)
   * E.g. "What are you doing?"
   */
  extractors[questionTypes.TOKEN] = function(response) {
    if(!response.tokens) {
      return [];
    }
    return response.tokens.map(function(t) { return t.text; });
  };
  /**
   * Restricted options answer
   * E.g. "Are you working?"
   */
  extractors[questionTypes.MULTIPLE_CHOICE] = function(response) {
    if(!response.answeredOptions) {
      return [];
    }
    return response.answeredOptions;
  };
  /**
   * Location-based answer (single location)
   * E.g. "Where are you?"
   */
  extractors[questionTypes.LOCATION] = function(response) {
    if(!response.locationResponse || !response.locationResponse.text) {
      return [];
    }
    return [response.locationResponse.text];
  };
  /**
   * People-based answer (multiple persons)
   * E.g. "Who are you with?"
   */
  extractors[questionTypes.NAME] = function(response) {
    if(!response.tokens) {
      return [];
    }
    return response.tokens.map(function(t) { return t.text; });
  };
  /**
   * Numeric answer (single number)
   * E.g. "How many teapots did you drink today?"
   */
  extractors[questionTypes.NUMERIC] = function(response) {
    if(!response.numericResponse) {
      return [];
    }
    return [response.numericResponse];
  };
  /**
   * Free text answer
   * E.g. "What did you learn today?"
   */
  extractors[questionTypes.FREE_TEXT] = function(response) {
    if(!response.textResponses) {
      return [];
    }
    return response.textResponses.map(function(t) { return t.text; });
  };
  /**
   * Yes / No answer
   * E.g. "Did you code today?"
   */
  extractors[questionTypes.YES_NO] = extractors[questionTypes.MULTIPLE_CHOICE];


  // For each question
  questions.forEach(function(q, i) {
    if(!(q.questionType in extractors)) {
      // TODO: support other kind of question types
      return;
    }

    questions[i].occurrences = 0;
    questions[i].tokens = {};
    var question = q.prompt;
    var extractTokens = extractors[q.questionType];

    snapshots.forEach(function(s) {
      s.responses.forEach(function(r) {
        if(r.questionPrompt === question) {
          questions[i].occurrences += 1;
          var tokens = extractTokens(r);
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
    snapshots: snapshots,
    entryCount: snapshots.length,
    questions: questions
  };

  return stats;
};

module.exports = getStats;
