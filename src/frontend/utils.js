var utils = {
    dateToISO8601Date(date) {
        // Month is 0 indexed in javascript `Date`.
        return [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-');
    }
}

module.exports = utils;
