var constants = require('./constants.js');

var apiClient = require('./apiClient.js')('/api');

var actions = {
    loadAbsenceDays(employee) {
        // Employee (id) is not mandatory. If no employee is supplied,
        // absence_days of all employees are fetched.
        apiClient.getAbsenceDays(employee).then(
            (res) => this.dispatch(constants.ABSENCE_LOAD_SUCCEEDED, res),
            (err) => console.log('TODO: handle this error:', err)
        );
    }
};

module.exports = actions;
