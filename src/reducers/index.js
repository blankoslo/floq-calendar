import { combineReducers } from 'redux';
import { Map, List } from 'immutable';
import dateFns from 'date-fns';

import {
  SET_CURRENT_ZOOM_LEVEL,
  SELECT_CURRENT_EMPLOYEE,
  SET_CURRENT_YEAR,
  SELECT_PREVIOUS_YEAR,
  SELECT_NEXT_YEAR,
  SET_CURRENT_MONTH,
  OPEN_ABSENCE_REASON_TOOL,
  CLOSE_ABSENCE_REASON_TOOL,
  SELECT_ABSENCE_REASON,
  LOAD_ABSENCE_REASONS,
  LOAD_HOLIDAYS,
  LOAD_EMPLOYEES,
  LOAD_ABSENCE,
  ADD_ABSENCE,
  REMOVE_ABSENCE
} from '../actions';

import { getApiConfig } from '../epics';

const initialState = {
  open: false,
  active: false,
  value: null
};

export default combineReducers({
  currentZoomLevel: (state = 1, action) => {
    switch (action.type) {
    case SET_CURRENT_ZOOM_LEVEL:
      return action.zoomLevel;
    default:
      return state;
    }
  },
  currentEmployee: (state = null, action) => {
    switch (action.type) {
    case SELECT_CURRENT_EMPLOYEE:
      return action.id;
    case LOAD_EMPLOYEES:
      const employee = action.employees
        .find((x) => getApiConfig().userEmail === x.email);
      return (employee && employee.id) || null;
    default:
      return state;
    }
  },
  currentYear: (state = 2017, action) => {
    switch (action.type) {
    case SET_CURRENT_YEAR:
      return action.currentYear;
    case SELECT_PREVIOUS_YEAR:
      return state - 1;
    case SELECT_NEXT_YEAR:
      return state + 1;
    default:
      return state;
    }
  },
  currentMonth: (state = 1, action) => {
    switch (action.type) {
    case SET_CURRENT_MONTH:
      return action.currentMonth;
    default:
      return state;
    }
  },
  absenceReasonTool: (state = initialState, action) => {
    switch (action.type) {
    case OPEN_ABSENCE_REASON_TOOL:
      return { ...state, open: true, active: false };
    case SELECT_CURRENT_EMPLOYEE:
    case CLOSE_ABSENCE_REASON_TOOL:
      return { ...state, open: false, active: false };
    case SELECT_ABSENCE_REASON:
      return { ...state, value: action.value, open: false, active: true };
    default:
      return state;
    }
  },
  absenceReasons: (state = List(), action) => {
    switch (action.type) {
    case LOAD_ABSENCE_REASONS:
      return action.absenceReasons;
    default:
      return state;
    }
  },
  holidays: (state = List(), action) => {
    switch (action.type) {
    case LOAD_HOLIDAYS:
      return action.holidays;
    default:
      return state;
    }
  },
  employees: (state = List(), action) => {
    switch (action.type) {
    case LOAD_EMPLOYEES:
      return action.employees;
    default:
      return state;
    }
  },
  originalAbsence: (state = Map(), action) => {
    switch (action.type) {
    case LOAD_ABSENCE:
      return action.absence;
    default:
      return state;
    }
  },
  absence: (state = Map(), action) => {
    switch (action.type) {
    case LOAD_ABSENCE:
      return action.absence;
    case ADD_ABSENCE:
      const newAbsence = {
        employeeId: action.employeeId,
        date: action.date,
        reason: action.reason
      };
      return state.update(action.employeeId,
                          Map([[dateFns.format(action.date, 'YYYY-M-D'), List([newAbsence])]]),
                          (x) => x.update(dateFns.format(action.date, 'YYYY-M-D'),
                                          (y) => List([newAbsence])));
    case REMOVE_ABSENCE:
      return state.update(action.employeeId,
                          (x) => x.update(dateFns.format(action.date, 'YYYY-M-D'),
                                          (y) => List()));
    default:
      return state;
    }
  }
});
