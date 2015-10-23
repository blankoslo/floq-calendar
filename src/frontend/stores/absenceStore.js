var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

var AbsenceStore = Fluxxor.createStore({
    initialize() {
        this.absenceDays = [];

        // TODO: Handle CUD and loading/failure etc.
        this.bindActions(
            constants.ABSENCE_LOAD_SUCCEEDED, this.onAbsenceLoaded
        );
    },

    onAbsenceLoaded(absenceDays) {
        // TODO: Handle multiple employees differently?
        this.absenceDays = absenceDays;
        this.emit('change');
    }
});

module.exports = AbsenceStore;
