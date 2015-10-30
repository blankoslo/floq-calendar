var constants = require('./constants.js');

var apiClient = require('./apiClient.js')('/api');

// TODO: This is a pretty hacky way to do history transitions.
var actionsClosure = function(history) {
    var actions = {
        googleSigninSucceeded(token) {
            this.dispatch(constants.GOOGLE_SIGN_IN_SUCCEEDED, token);
        },

        getLoggedInEmployee() {
            var token = this.flux.store('UserStore').token;
            apiClient.getLoggedInEmployee(token).then(
                (res) => {
                    this.dispatch(constants.GET_LOGGED_IN_EMPLOYEE_SUCCEEDED, res);
                    //history.pushState(null, `/calendar/${res.id}`);
                    history.pushState(null, `/calendar`);
                },
                (err) => {
                    history.pushState(null, `/`);
                    console.log('TODO: handle this error:', err);
                }
            );
        },

        loadAbsenceTypes() {
            var token = this.flux.store('UserStore').token;
            apiClient.loadAbsenceTypes(token).then(
                (res) => this.dispatch(constants.ABSENCE_TYPES_LOAD_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        absenceTypeChange(type) {
            this.dispatch(constants.ABSENCE_TYPE_CHANGED, type);
        },

        loadEmployees() {
            var token = this.flux.store('UserStore').token;
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
            var token = this.flux.store('UserStore').token;
            apiClient.loadAbsenceDays(employee, from, to, token).then(
                (res) => this.dispatch(constants.ABSENCE_LOAD_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        createAbsenceDay(employee, type, date) {
            var token = this.flux.store('UserStore').token;
            apiClient.createAbsenceDay(employee, type, date, token).then(
                (res) => this.dispatch(constants.ABSENCE_CREATE_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        updateAbsenceDay(selected, absenceDay) {
            var token = this.flux.store('UserStore').token;
            apiClient.updateAbsenceDay(selected, absenceDay, token).then(
                (res) => this.dispatch(constants.ABSENCE_UPDATE_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        },

        deleteAbsenceDay(absenceDay) {
            var token = this.flux.store('UserStore').token;
            apiClient.deleteAbsenceDay(absenceDay, token).then(
                (res) => this.dispatch(constants.ABSENCE_DELETE_SUCCEEDED, res),
                (err) => console.log('TODO: handle this error:', err)
            );
        }
    }

    return actions;
};

module.exports = actionsClosure;
