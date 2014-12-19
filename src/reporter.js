'use strict';
/*
 * @file Support for [Reporter.app](http://www.reporter-app.com/) data
 * Expected format: JSON
 */

/**
 * Get simple stats (number of entries, etc)
 */
var getStats = function(data) {
  var snapshots = data.snapshots;
  var stats = {
    entry_count: snapshots.length
  };

  return stats;
};

module.exports = {
  getStats: getStats
};
