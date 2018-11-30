import { combineReducers } from 'redux';
import { Map, List } from 'immutable';
import dateFns from 'date-fns';

import {
  SELECT_CURRENT_EMPLOYEE,
  SET_CURRENT_YEAR,
  SELECT_PREVIOUS_YEAR,
  SELECT_NEXT_YEAR,
  LOAD_ABSENCE_REASONS,
  LOAD_HOLIDAYS,
  LOAD_EMPLOYEES,
  LOAD_ABSENCE,
  ADD_ABSENCE,
  REMOVE_ABSENCE,
  LOAD_HOLIDAY_DAYS
} from '../actions';

import { getApiConfig } from '../epics';

export default combineReducers({
  currentEmployee: (state = null, action) => {
    switch (action.type) {
      case SELECT_CURRENT_EMPLOYEE:
        return action.id;
      case LOAD_EMPLOYEES:
        const url = window.location.href;
        const id = url.substr(url.lastIndexOf('/') + 1);
        if (id !== 'calendar') {
          return id;
        }
        const employee = action.employees
          .find((x) => getApiConfig().userEmail === x.email);
        return (employee && employee.id) || null;
      default:
        return state;
    }
  },
  currentYear: (state = 2018, action) => {
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
  },
  holidayDays: (state = Map(), action) => {
    switch (action.type) {
      case LOAD_HOLIDAY_DAYS:
        return action.days;
      default:
        return state;
    }
  }
});
