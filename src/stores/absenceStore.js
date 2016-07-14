const Fluxxor = require('fluxxor');

const constants = require('./../constants.js');

const utils = require('./../utils.js');

const AbsenceStore = Fluxxor.createStore({
    initialize() {
        this.absenceDays = {};

        // TODO: Handle CUD and loading/failure etc.
        this.bindActions(
            constants.ABSENCE_LOAD_SUCCEEDED, this.onAbsenceLoaded,
            constants.ABSENCE_CREATE_SUCCEEDED, this.onAbsenceCreated,
            constants.ABSENCE_UPDATE_SUCCEEDED, this.onAbsenceUpdated,
            constants.ABSENCE_DELETE_SUCCEEDED, this.onAbsenceDeleted
        );
    },

    onAbsenceLoaded(absenceDays) {
        if (absenceDays.length == 0) return;
        absenceDays.forEach(this._addAbsenceDay);
        this.emit('change');
    },

    onAbsenceCreated(absenceDays) {
        utils.forEachIfArray(absenceDays, this._addAbsenceDay);
        this.emit('change');
    },

    onAbsenceUpdated(absenceDays) {
        utils.forEachIfArray(absenceDays, this._updateAbsenceDay);
        this.emit('change');
    },

    onAbsenceDeleted(absenceDayIds) {
        utils.forEachIfArray(absenceDayIds, this._deleteAbsenceDay);
        this.emit('change');
    },

    _addAbsenceDay(absenceDay) {
        var employee = absenceDay.employee;

        if (!this.absenceDays[employee]) this.absenceDays[employee] = [];

        this.absenceDays[employee].push(absenceDay);
    },

    _updateAbsenceDay(absenceDay) {
        var employee = absenceDay.employee;

        if (!this.absenceDays[employee]) {
            console.error("Can't update nonexistant absence!");
            return;
        }

        this.absenceDays[employee].forEach((day, i) => {
            if (day.date === absenceDay.date) {
                this.absenceDays[employee][i] = absenceDay;
            }
        });
    },

    _deleteAbsenceDay(absenceDay) {
        Object.keys(this.absenceDays).forEach((employee) => {
            this.absenceDays[employee] =
                this.absenceDays[employee].filter((currDay) => {
                return !(absenceDay.project.id === currDay.project.id &&
                         absenceDay.date === currDay.date);
            });
        });

    }
});

module.exports = AbsenceStore;
