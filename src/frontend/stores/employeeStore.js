var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

var EmployeeStore = Fluxxor.createStore({
    initialize() {
        this.employees = [];

        this.bindActions(
            constants.EMPLOYEE_LOAD_SUCCEEDED, this.onEmployeesLoaded
        );
    },

    onEmployeesLoaded(employees) {
        this.employees = employees;
        this.emit('change');
    }
});

module.exports = EmployeeStore;
