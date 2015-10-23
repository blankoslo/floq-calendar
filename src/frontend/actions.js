var constants = require('./constants.js');

var apiClient = require('./apiClient.js')('/api');

var actions = {
    loadAbsenceTypes() {
        apiClient.loadAbsenceTypes().then(
            (res) => this.dispatch(constants.ABSENCE_TYPES_LOAD_SUCCEEDED, res),
            (err) => console.log('TODO: handle this error:', err)
        );
    },

    absenceTypeChange(type) {
        this.dispatch(constants.ABSENCE_TYPE_CHANGED, type);
    },

    loadAbsenceDays(employee) {
        // Employee (id) is not mandatory. If no employee is supplied,
        // absence_days of all employees are fetched.
        apiClient.loadAbsenceDays(employee).then(
            (res) => this.dispatch(constants.ABSENCE_LOAD_SUCCEEDED, res),
            (err) => console.log('TODO: handle this error:', err)
        );
    },

    createAbsenceDay(date) {
        // TODO: Is this the correct place to get this?
        var selected = this.flux.store('AbsenceTypeStore').selected;

        apiClient.createAbsenceDay(selected, date).then(
            (res) => this.dispatch(constants.ABSENCE_CREATE_SUCCEEDED, res),
            (err) => console.log('TODO: handle this error:', err)
        );
    }
};

module.exports = actions;
