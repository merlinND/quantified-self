'use strict';

/**
 * A collection of grouping functions
 */
var groupBy = {
  /**
   * @param `snapshots` Array of elements
   * @param `criterion` Function Element => Key
   */
  criterion: function(snapshots, criterion) {
    var Groups = function(snapshots) {
      var self = this;

      snapshots.forEach(function(element) {
        var group = criterion(element);
        self[group] = self[group] || [];
        self[group].push(element);
      });
    };

    /**
     * Utility function
     * @return List of list (i.e. simply ommit the keys)
     */
    Groups.prototype.asList = function() {
      var self = this;
      return Object.keys(self).map(function(key) { return self[key]; });
    };
    /**
     * Utility function
     * @return List (i.e. recover a single concatenated list)
     *
     * @see http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
     */
    Groups.prototype.asFlatList = function() {
      return [].concat.apply([], this.asList());
    };

    return new Groups(snapshots);
  },

  date: function(snapshots) {
    return groupBy.criterion(snapshots, function(snapshot) {
      var d = new Date(snapshot.date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    });
  },

  month: function(snapshots) {
    return groupBy.criterion(snapshots, function(snapshot) {
      var d = new Date(snapshot.date);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    });
  },

  year: function(snapshots) {
    return groupBy.criterion(snapshots, function(snapshot) {
      var d = new Date(snapshot.date);
      return new Date(d.getFullYear(), 0, 1);
    });
  },

  dayOfTheWeek: function(snapshots) {
    return groupBy.criterion(snapshots, function(snapshot) {
      var d = new Date(snapshot.date);
      return d.getDay();
    });
  }
};

module.exports = groupBy;
