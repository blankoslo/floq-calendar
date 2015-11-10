var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

var UserStore = Fluxxor.createStore({
    initialize() {
        this.employee = {};
        // TODO: HACK! Supplied by frontpage app.
        this.token = window.id_token;
        console.log("userstoreinit", this.token);

        this.bindActions(
            constants.GET_LOGGED_IN_EMPLOYEE_SUCCEEDED, this.onEmployeeLoaded
        );
    },

    onEmployeeLoaded(employee) {
        this.employee = employee;
        this.emit('change');
    }
});

module.exports = UserStore;
