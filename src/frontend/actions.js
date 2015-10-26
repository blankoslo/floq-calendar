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

    createAbsenceDay(selected, date) {
        apiClient.createAbsenceDay(selected, date).then(
            (res) => this.dispatch(constants.ABSENCE_CREATE_SUCCEEDED, res),
            (err) => console.log('TODO: handle this error:', err)
        );
    },

    updateAbsenceDay(selected, absenceDay) {
        apiClient.updateAbsenceDay(selected, absenceDay).then(
            (res) => this.dispatch(constants.ABSENCE_UPDATE_SUCCEEDED, res),
            (err) => console.log('TODO: handle this error:', err)
        );
    },

    deleteAbsenceDay(absenceDay) {
        apiClient.deleteAbsenceDay(absenceDay).then(
            (res) => this.dispatch(constants.ABSENCE_DELETE_SUCCEEDED, res),
            (err) => console.log('TODO: handle this error:', err)
        );
    }
};

module.exports = actions;
