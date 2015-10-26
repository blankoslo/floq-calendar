var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

var AbsenceStore = Fluxxor.createStore({
    initialize() {
        this.absenceDays = [];

        // TODO: Handle CUD and loading/failure etc.
        this.bindActions(
            constants.ABSENCE_LOAD_SUCCEEDED, this.onAbsenceLoaded,
            constants.ABSENCE_CREATE_SUCCEEDED, this.onAbsenceCreated,
            constants.ABSENCE_DELETE_SUCCEEDED, this.onAbsenceDeleted
        );
    },

    onAbsenceLoaded(absenceDays) {
        // TODO: Handle multiple employees differently?
        this.absenceDays = absenceDays;
        this.emit('change');
    },

    onAbsenceCreated(absenceDays) {
        if (Array.isArray(absenceDays)) {
            absenceDays.forEach((day) => this.absenceDays.push(day));
        } else {
            this.absenceDays.push(absenceDays);
        }

        this.emit('change');
    },

    // TODO: This is pretty hacky and bad...
    onAbsenceDeleted(ids) {
        if (Array.isArray(ids)) {
            this.absenceDays = this.absenceDays.filter((day) => {
                for (id of ids) {
                    if (id.id === day.id) return false;
                }

                return true;
            });
        } else {
            console.error("DELETE on empty store, shouldn't be possible!");
        }

        this.emit('change');
    }
});

module.exports = AbsenceStore;
