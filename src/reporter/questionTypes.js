'use strict';
/*
 * @file Enumeration of the question types available:
 * 0: Token-based answer (multiple tokens)
 * 1: Yes / No answer
 * 2: Restricted options answer
 * 3: Location-based answer (single location)
 * 4: People-based answer (multiple persons)
 * 5: Numeric answer (single number)
 * 6: Free text answer
 */
module.exports = {
  TOKEN: 0,
  MULTIPLE_CHOICE: 1,
  YES_NO: 2,
  LOCATION: 3,
  NAME: 4,
  NUMERIC: 5,
  FREE_TEXT: 6
};
