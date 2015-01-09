'use strict';

/**
 * @file Collection of simple logging functions
 * to be applied to a list of snapshots (snapshots.map)
 */

var dateLogger = function(s) {
  console.log(new Date(s.date));
};

var placeLogger = function(s) {
  var hasLocationName = s.location && s.location.placemark && s.location.placemark.name;
  console.log(hasLocationName ? s.location.placemark.name : '?');
};

module.exports = {
  date: dateLogger,
  place: placeLogger
};
