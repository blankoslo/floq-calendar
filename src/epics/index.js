import { List } from 'immutable';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import moment from 'moment';

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
          date: moment(y.date),
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

const fetchAbsenceEpic = action$ => action$
        .ofType(FETCH_ABSENCE)
        .mergeMap((x) => Observable.ajax({
          url: `${getApiConfig().apiHost}/absence`,
          method: 'GET',
          responseType: 'json',
          headers: {
            'Authorization': 'Bearer ' + getApiConfig().apiToken
          }
        }))
        .map((x) => List(x.response).map((y) => ({
          employeeId: y.employee_id.toString(),
          date: moment(y.date),
          reason: y.reason
        })))
        .map((x) => x.groupBy((y) => y.employeeId))
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

const updateAbsenceEpic = action$ => action$
        .ofType(UPDATE_ABSENCE)
        .mergeMap((x) => Observable.zip(
          (x.adds.size > 0 && Observable.ajax({
            url: `${getApiConfig().apiHost}/staffing`,
            method: 'POST',
            body: JSON.stringify(x.adds.map((y) => ({
              employee: x.employeeId,
              project: x.reason,
              date: y.format('YYYY-MM-DD')
            })).toArray()),
            headers: {
              'Authorization': 'Bearer ' + getApiConfig().apiToken,
              'Content-Type': 'application/json;charset=utf-8'
            }
          })) || Observable.of(null),
          (x.changes.size > 0 && Observable.ajax({
            url: `${getApiConfig().apiHost}/staffing?employee=eq.${x.employeeId}&date=in.${x.changes.map((y) => y.format('YYYY-MM-DD')).join()}`,
            method: 'PATCH',
            body: JSON.stringify({
              project: x.reason
            }),
            headers: {
              'Authorization': 'Bearer ' + getApiConfig().apiToken,
              'Content-Type': 'application/json;charset=utf-8'
            }
          })) || Observable.of(null),
          (x.removes.size > 0 && Observable.ajax({
            url: `${getApiConfig().apiHost}/staffing?employee=eq.${x.employeeId}&date=in.${x.removes.map((y) => y.format('YYYY-MM-DD')).join()}`,
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + getApiConfig().apiToken
            }
          })) || Observable.of(null)
        ))
        .mergeMap(() => Observable.ajax({
          url: `${getApiConfig().apiHost}/absence`,
          method: 'GET',
          responseType: 'json',
          headers: {
            'Authorization': 'Bearer ' + getApiConfig().apiToken
          }
        }))
        .map((x) => List(x.response))
        .map((x) => x.map((y) => ({
          employeeId: y.employee_id.toString(),
          date: moment(y.date),
          reason: y.reason
        })))
        .map((x) => x.groupBy((y) => y.employeeId))
        .map(loadAbsence);

export default combineEpics(
  fetchAbsenceReasonsEpic,
  fetchHolidaysEpic,
  fetchEmployeesEpic,
  fetchAbsenceEpic,
  updateAbsenceEpic
);
