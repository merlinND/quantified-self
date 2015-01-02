'use strict';
/*
 * @file Support for [Reporter.app](http://www.reporter-app.com/) data
 * Expected format: JSON
 */

/*
 * Enumeration of the "report impetus" available:
 *   - 0: voluntary reporting
 *   - 1: ?
 *   - 2: random sample
 *   - 3: going to sleep
 *   - 4: just woke up
 */
var reasons = {
  VOLUNTARY: 0,
  RANDOM: 2,
  SLEEP: 3,
  WAKE: 4
};

/**
 * For each question, extract all tokens (and their count)
 * Augment `questions` with the `tokens` (token => count) object
 */
var extractTokens = function(snapshots, questions) {
  /**
   * Each kind of questions has a different
   * way of representing answers
   */
  var extractors = {
    /**
     * Token-based answer (multiple tokens)
     * E.g. "What are you doing?"
     */
    0: function(response) {
      if(!response.tokens) {
        return [];
      }
      return response.tokens.map(function(t) { return t.text; });
    },
    /**
     * Restricted options answer
     * E.g. "Are you working?"
     */
    1: function(response) {
      if(!response.answeredOptions) {
        return [];
      }
      return response.answeredOptions;
    },
     /**
     * Location-based answer (single location)
     * E.g. "Where are you?"
     */
    3: function(response) {
      if(!response.locationResponse || !response.locationResponse.text) {
        return [];
      }
      return [response.locationResponse.text];
    },
     /**
     * People-based answer (multiple persons)
     * E.g. "Who are you with?"
     */
    4: function(response) {
      if(!response.tokens) {
        return [];
      }
      return response.tokens.map(function(t) { return t.text; });
    },
     /**
     * Numeric answer (single number)
     * E.g. "How many teapots did you drink today?"
     */
    5: function(response) {
      if(!response.numericResponse) {
        return [];
      }
      return [response.numericResponse];
    },
     /**
     * Free text answer
     * E.g. "What did you learn today?"
     */
    6: function(response) {
      if(!response.textResponses) {
        return [];
      }
      return response.textResponses.map(function(t) { return t.text; });
    }
  };
  /**
   * Yes / No answer
   * E.g. "Did you code today?"
   */
  extractors[2] = extractors[1];


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
 * A collection of filters that can be applied
 * to a list of snapshots.
 */
var filters = {
  /**
   * Example filter: require a given battery level
   * @param `minLevel` Battery level (0..1)
   */
  hasBatteryLevel: function(minLevel) {
    return function(snapshot) {
      return snapshot.battery && snapshot.battery >= minLevel;
    };
  },

  /**
   * @param `reason` Should be one of:
   *   - 0: voluntary reporting
   *   - 1: ?
   *   - 2: random sample
   *   - 3: going to sleep
   *   - 4: just woke up
   */
  wasTriggeredBy: function(reason) {
    return function(snapshot) {
      return (snapshot.reportImpetus === reason);
    };
  },

  /**
   * Select snapshots which were triggered in the time
   * interval between `start` (included) and `end` (excluded).
   * @param `start` Date object
   * @param [`end`] Date object (optional)
   *   If omitted, will include snapshots up to the most recent.
   */
  byDate: function(start, end) {
    // TODO: support selecting by day, day of the week, hour of the day, etc
    return function(snapshot) {
      var d = new Date(snapshot.date);
      if(!end) {
        return (d >= start);
      }

      return (d >= start) && (d < end);
    };
  },

  /**
   * Select snapshots which were triggered on the same
   * day of the week as `day`
   * @param `date` 0..6 Day of the week index,
   *   where 0 is Sunday and 6 is Saturday
   */
  byDayOfTheWeek: function(day) {
    return function(snapshot) {
      var d = new Date(snapshot.date);
      return (d.getDay() === day);
    };
  },

  /**
   * @param month 0..11 Month index,
   *   where 0 is January and 12 is December
   * @param [year] E.g. 2014. Optional,
   *   If omitted, will allow any year.
   */
  byMonth: function(month, year) {
    return function(snapshot) {
      var d = new Date(snapshot.date);
      if(year) {
        return (d.getMonth() === month) && (d.getFullYear() === year);
      }

      return (d.getMonth() === month);
    };
  }
};
filters.hasFullBattery = filters.hasBatteryLevel(1);
filters.byDay = function(date) {
  var start = date;
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  var end = new Date(start.getTime() + 1000 * 60 * 60 * 24);

  return filters.byDate(start, end);
};
filters.happenedBefore = function(date) {
  return filters.byDate(new Date(0), date);
};
filters.happenedAfter = function(date) {
  return filters.byDate(date);
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
  getStats: getStats,
  printMainTokens: printMainTokens,
  filters: filters,
  reasons: reasons
};
