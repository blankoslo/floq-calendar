var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

var EmployeeStore = Fluxxor.createStore({
    initialize() {
        this.loggedInEmployee = null;
        this.employees = [];

        this.bindActions(
            constants.GET_LOGGED_IN_EMPLOYEE_SUCCEEDED, this.onLoggedInEmployeeLoaded,
            constants.EMPLOYEE_LOAD_SUCCEEDED, this.onEmployeesLoaded
        );
    },

    onLoggedInEmployeeLoaded(employee) {
        this.loggedInEmployee = employee;
        this.emit('change');
    },

    onEmployeesLoaded(employees) {
        this.employees = employees;
        this.emit('change');
    }
});

module.exports = EmployeeStore;
