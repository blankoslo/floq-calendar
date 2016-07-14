const Fluxxor = require('fluxxor');
const constants = require('./../constants.js');

const AbsenceTypeStore = Fluxxor.createStore({
  initialize() {
    this.absenceTypes = [];
    this.selected = null;

    // TODO: Handle CUD and loading/failure etc.
    this.bindActions(
        constants.ABSENCE_TYPES_LOAD_SUCCEEDED, this.onAbsenceTypesLoaded,
        constants.ABSENCE_TYPE_CHANGED, this.onAbsenceTypeChange
    );
  },

  onAbsenceTypesLoaded(absenceTypes) {
    this.absenceTypes = absenceTypes;
    this.selected = absenceTypes.length > 0 ?
        absenceTypes[0].id : null;
    this.emit('change');
  },

  onAbsenceTypeChange(typeId) {
    // The "value"-field of a <select> is a string, so we must cast.
    this.selected = typeId;
    this.emit('change');
  }
});

module.exports = AbsenceTypeStore;
