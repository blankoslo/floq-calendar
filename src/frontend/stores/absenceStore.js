"use strict"

var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

var AbsenceStore = Fluxxor.createStore({
    initialize() {
        this.absenceDays = [];

        // TODO: Handle CUD and loading/failure etc.
        this.bindActions(
            constants.ABSENCE_LOAD_SUCCEEDED, this.onAbsenceLoaded,
            constants.ABSENCE_CREATE_SUCCEEDED, this.onAbsenceCreated,
            constants.ABSENCE_UPDATE_SUCCEEDED, this.onAbsenceUpdated,
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

    onAbsenceUpdated(absenceDay) {
        for (let i = 0; i < this.absenceDays.length; i++) {
            if (this.absenceDays[i].id == absenceDay.id) {
                this.absenceDays[i] = absenceDay;
                break;
            }
        }

        this.emit('change');
    },

    // TODO: This is pretty hacky and bad...
    onAbsenceDeleted(ids) {
        if (Array.isArray(ids)) {
            this.absenceDays = this.absenceDays.filter((day) => {
                for (let i = 0; i < ids.length; i++) {
                    if (ids[i].id === day.id) return false;
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
