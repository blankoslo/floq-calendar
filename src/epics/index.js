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
export const updateAbsence = (updates, employeeId) => ({
  type: UPDATE_ABSENCE,
  updates,
  employeeId
});

const addAbsenceAsync = (adds) =>
  (adds.size > 0 && Observable.ajax({
    url: `${getApiConfig().apiHost}/absence`,
    method: 'POST',
    body: JSON.stringify(adds.map((x) => ({
      employee_id: x.employeeId,
      reason: x.reason,
      date: dateFns.format(x.date, 'YYYY-MM-DD')
    })).toArray()),
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken,
      'Content-Type': 'application/json;charset=utf-8'
    }
  })) || Observable.of(null);


const changeAbsenceAsync = (changes, employeeId) => {
  const changeReasonMap = changes.reduce((acc, curr) => {
    const array = acc[curr.reason] ? acc[curr.reason] : [];
    array.push(curr.date);
    return {
      ...acc,
      [curr.reason]: array
    }
  }, {});

  return (Object.keys(changeReasonMap).map(reason => {
    const dates = changeReasonMap[reason].map((x) => dateFns.format(x, 'YYYY-MM-DD')).join();
    const url = `${getApiConfig().apiHost}/absence?employee_id=eq.${employeeId}&date=in.${dates}`;
    return (changeReasonMap[reason].length > 0 && Observable.ajax({
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
  }));
};

const removeAbsenceAsync = (removes, employeeId) => {
  const dates = removes.map((x) => dateFns.format(x.date, 'YYYY-MM-DD')).join();
  const url = `${getApiConfig().apiHost}/absence` +
    `?employee_id=eq.${employeeId}&date=in.${dates}`;

  return (removes.size > 0 && Observable.ajax({
    url: url,
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + getApiConfig().apiToken
    }
  })) || Observable.of(null)
};

const updateAbsenceEpic = action$ => action$
  .ofType(UPDATE_ABSENCE)
  .mergeMap((x) => Observable.zip(
    addAbsenceAsync(x.updates.adds),
    ...changeAbsenceAsync(x.updates.changes, x.employeeId),
    removeAbsenceAsync(x.updates.removes, x.employeeId)
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
