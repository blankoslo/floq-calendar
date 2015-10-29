var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

var UserStore = Fluxxor.createStore({
    initialize() {
        this.employee = {};
        this.token = null;

        this.bindActions(
            constants.GOOGLE_SIGN_IN_SUCCEEDED, this.onGoogleSignin,
            constants.GET_LOGGED_IN_EMPLOYEE_SUCCEEDED, this.onEmployeeLoaded
        );
    },

    onGoogleSignin(token) {
        this.token = token;
        this.emit('change');
    },

    onEmployeeLoaded(employee) {
        this.employee = employee;

        console.log('sweet')
        this.emit('change');
    }
});

module.exports = UserStore;
