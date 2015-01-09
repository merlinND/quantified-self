'use strict';

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
   * @param `minSpeed` Minimum speed (probably km.h^-1)
   * @TODO Check unit
   * @warning This measurement is probably quite inaccurate
   */
  hasSpeed: function(minSpeed) {
    return function(snapshot) {
      return snapshot.location &&
        snapshot.location.speed &&
        snapshot.location.speed >= minSpeed;
    };
  },

  /**
   * Require the snapshot to contain a named (Foursquare-type) location
   * @warning This does not check for the "Where are you?" question
   */
  hasNamedLocation: function() {
    return function(snapshot) {
      return snapshot.location &&
        snapshot.location.placemark &&
        snapshot.location.placemark.name;
    };
  },

  /**
   * @param `location` Name (string) of the location
   */
  byNamedLocation: function(location) {
    return function(snapshot) {
      return snapshot.location &&
        snapshot.location.placemark &&
        snapshot.location.placemark.name === location;
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

module.exports = filters;
