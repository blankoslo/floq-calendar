const utils = {
  dateToISO8601Date(date) {
    // Month is 0 indexed in javascript `Date`.
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
  },

  forEachIfArray(o, func) {
    if (Array.isArray(o)) {
      o.forEach(func);
    } else {
      func(o);
    }
  }
};

module.exports = utils;
