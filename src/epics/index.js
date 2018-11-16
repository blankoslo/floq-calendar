import { List } from 'immutable';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import dateFns from 'date-fns';
import parse from 'date-fns/parse';

import {
  loadAbsenceReasons, loadEmployees, loadHolidays, loadAbsence
} from '../actions';

export const getApiConfig = () => ({
  apiToken: window.apiToken,
  apiHost: window.config.apiUri,
  userEmail: window.userEmail
});

export const FETCH_ABSENCE_REASONS = 'FETCH_ABSENCE_REASONS';
export const fetchAbsenceReasons = () => ({
  type: FETCH_ABSENCE_REASONS
});

const fetchAbsenceReasonsEpic = action$ => action$
  .ofType(FETCH_ABSENCE_REASONS)
  .mergeMap((x) => Observable.ajax({
    url: `${getApiConfig().apiHost}/absence_reasons`,
    method: 'GET',
    responseType: 'json',
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken
    }
  }))
  .map((x) => List(x.response))
  .map(loadAbsenceReasons);

export const FETCH_HOLIDAYS = 'FETCH_HOLIDAYS';
export const fetchHolidays = () => ({
  type: FETCH_HOLIDAYS
});

const fetchHolidaysEpic = action$ => action$
  .ofType(FETCH_HOLIDAYS)
  .mergeMap((x) => Observable.ajax({
    url: `${getApiConfig().apiHost}/holidays`,
    method: 'GET',
    responseType: 'json',
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken
    }
  }))
  .map((x) => List(x.response).map((y) => ({
    date: parse(y.date),
    name: y.name
  })))
  .map(loadHolidays);

export const FETCH_EMPLOYEES = 'FETCH_EMPLOYEES';
export const fetchEmployees = () => ({
  type: FETCH_EMPLOYEES
});

const fetchEmployeesEpic = action$ => action$
  .ofType(FETCH_EMPLOYEES)
  .mergeMap((x) => Observable.ajax({
    url: `${getApiConfig().apiHost}/employees`,
    method: 'GET',
    responseType: 'json',
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken
    }
  }))
  .map((x) => List(x.response).map((y) => ({
    id: y.id.toString(),
    name: `${y.first_name} ${y.last_name}`,
    email: y.email
  })))
  .map(loadEmployees);

export const FETCH_ABSENCE = 'FETCH_ABSENCE';
export const fetchAbsence = () => ({
  type: FETCH_ABSENCE
});

const fetchAbsenceAsync = () =>
  Observable.ajax({
    url: `${getApiConfig().apiHost}/absence`,
    method: 'GET',
    responseType: 'json',
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken
    }
  })
    .map((x) => List(x.response).map((y) => ({
      employeeId: y.employee_id.toString(),
      date: parse(y.date),
      reason: y.reason
    })))
    .map((x) => x.groupBy((y) => y.employeeId)
      .map((y) => y.groupBy((z) => dateFns.format(z.date, 'YYYY-M-D'))));

const fetchAbsenceEpic = action$ => action$
  .ofType(FETCH_ABSENCE)
  .mergeMap(fetchAbsenceAsync)
  .map(loadAbsence);

export const UPDATE_ABSENCE = 'UPDATE_ABSENCE';
export const updateAbsence = (employeeId, reason, adds, changes, removes) => ({
  type: UPDATE_ABSENCE,
  employeeId,
  reason,
  adds,
  changes,
  removes
});

const addAbsenceAsync = (employeeId, reason, adds) =>
  (adds.size > 0 && Observable.ajax({
    url: `${getApiConfig().apiHost}/absence`,
    method: 'POST',
    body: JSON.stringify(adds.map((x) => ({
      employee_id: employeeId,
      reason: reason,
      date: dateFns.format(x, 'YYYY-MM-DD')
    })).toArray()),
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken,
      'Content-Type': 'application/json;charset=utf-8'
    }
  })) || Observable.of(null);

const changeAbsenceAsync = (employeeId, reason, changes) => {
  const dates = changes.map((x) => dateFns.format(x, 'YYYY-MM-DD')).join();
  const url = `${getApiConfig().apiHost}/absence` +
    `?employee_id=eq.${employeeId}&date=in.${dates}`;
  return (changes.size > 0 && Observable.ajax({
    url: url,
    method: 'PATCH',
    body: JSON.stringify({
      reason: reason
    }),
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken,
      'Content-Type': 'application/json;charset=utf-8'
    }
  })) || Observable.of(null);
};

const removeAbsenceAsync = (employeeId, reason, removes) => {
  const dates = removes.map((x) => dateFns.format(x, 'YYYY-MM-DD')).join();
  const url = `${getApiConfig().apiHost}/absence` +
    `?employee_id=eq.${employeeId}&date=in.${dates}`;
  return (removes.size > 0 && Observable.ajax({
    url: url,
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken
    }
  })) || Observable.of(null);
};

const updateAbsenceEpic = action$ => action$
  .ofType(UPDATE_ABSENCE)
  .mergeMap((x) => Observable.zip(
    addAbsenceAsync(x.employeeId, x.reason, x.adds),
    changeAbsenceAsync(x.employeeId, x.reason, x.changes),
    removeAbsenceAsync(x.employeeId, x.reason, x.removes)
  ))
  .mergeMap(() => fetchAbsenceAsync())
  .map(loadAbsence);

export default combineEpics(
  fetchAbsenceReasonsEpic,
  fetchHolidaysEpic,
  fetchEmployeesEpic,
  fetchAbsenceEpic,
  updateAbsenceEpic
);
