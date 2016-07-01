var constants = require('./constants.js');

var apiClient = require('./apiClient.js')(window.config.apiUri);

// TODO: This is a pretty hacky way to do history transitions.
var actionsClosure = function(history) {
    var actions = {
        getLoggedInEmployee(mail) {
            var token = window.apiToken;
            apiClient.getLoggedInEmployee(mail, token).then(
                (res) => this.dispatch(constants.GET_LOGGED_IN_EMPLOYEE_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        loadAbsenceTypes() {
            var token = window.apiToken;
            apiClient.loadAbsenceTypes(token).then(
                (res) => this.dispatch(constants.ABSENCE_TYPES_LOAD_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        absenceTypeChange(typeId) {
            this.dispatch(constants.ABSENCE_TYPE_CHANGED, typeId);
        },

        loadEmployees() {
            var token = window.apiToken;
            apiClient.loadEmployees(token).then(
                (res) => this.dispatch(constants.EMPLOYEE_LOAD_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        newEmployeeSelected(employee) {
            history.pushState(null, `/calendar/${employee}`);
        },

        loadAbsenceDays(employee, from, to) {
            // Employee (id) is not mandatory. If no employee is supplied,
            // absence_days of all employees are fetched.
            var token = window.apiToken;
            apiClient.loadAbsenceDays(employee, from, to, token).then(
                (res) => this.dispatch(constants.ABSENCE_LOAD_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        createAbsenceDay(employee, type, date) {
            var token = window.apiToken;
            apiClient.createAbsenceDay(employee, type, date, token).then(
                (res) => this.dispatch(constants.ABSENCE_CREATE_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        updateAbsenceDay(selected, absenceDay) {
            var token = window.apiToken;
            apiClient.updateAbsenceDay(selected, absenceDay, token).then(
                (res) => this.dispatch(constants.ABSENCE_UPDATE_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        deleteAbsenceDay(absenceDay) {
            var token = window.apiToken;
            apiClient.deleteAbsenceDay(absenceDay, token).then(
                (res) => this.dispatch(constants.ABSENCE_DELETE_SUCCEEDED, absenceDay),
                (err) => console.log('TODO: handle this error:', err)
            );
        }
    }

    return actions;
};

module.exports = actionsClosure;
