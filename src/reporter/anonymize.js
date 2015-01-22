'use strict';

var faker = require('faker');
var questionTypes = require('./questionTypes.js');

var getNewFakeName = faker.name.findName;

/**
 * For all questions taking people names as an answer,
 * replace actual names by fake names (with consistency)
 */
module.exports = function anonymize(snapshots, questions) {
  /** Real name => fake name */
  var names = {};

  var replaceNames = function(t) {
    var realName = t.text;
    if(!names[realName]) {
      names[realName] = getNewFakeName();
    }

    return {
      text: names[realName]
    };
  };

  /** Question prompt => does it take names as answers? */
  var isNameBased = {};
  questions.forEach(function(q) {
    isNameBased[q.prompt] = q.questionType === questionTypes.NAME;
  });

  // For each snapshot
  snapshots.forEach(function(s) {
    // For each question
    s.responses.forEach(function(q) {
      // If it takes person names as an answer
      if(isNameBased[q.questionPrompt] && q.tokens) {
        // Replace each name by its fake version
        q.tokens = q.tokens.map(replaceNames);
      }
    });
  });
};
