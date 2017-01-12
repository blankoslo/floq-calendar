import { List } from 'immutable';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import dateFns from 'date-fns';
import parse from 'date-fns/parse';

import {
  loadAbsenceReasons, loadEmployees, loadHolidays, loadAbsence, loadStaffing
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

export const FETCH_STAFFING = 'FETCH_STAFFING';
export const fetchStaffing = () => ({
  type: FETCH_STAFFING
});

const fetchStaffingAsync = () =>
        Observable.ajax({
          url: `${getApiConfig().apiHost}/staffing`,
          method: 'GET',
          responseType: 'json',
          headers: {
            'Authorization': 'Bearer ' + getApiConfig().apiToken
          }
        })
        .map((x) => List(x.response).map((y) => ({
          employeeId: y.employee.toString(),
          date: parse(y.date),
          reason: y.project
        })))
        .map((x) => x.groupBy((y) => y.employeeId)
             .map((y) => y.groupBy((z) => dateFns.format(z.date, 'YYYY-M-D'))));

const fetchStaffingEpic = action$ => action$
        .ofType(FETCH_STAFFING)
        .mergeMap(fetchStaffingAsync)
        .map(loadStaffing);

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

const updateAbsenceEpic = action$ => action$
        .ofType(UPDATE_ABSENCE)
        .mergeMap((x) => Observable.zip(
          (x.adds.size > 0 && Observable.ajax({
            url: `${getApiConfig().apiHost}/staffing`,
            method: 'POST',
            body: JSON.stringify(x.adds.map((y) => ({
              employee: x.employeeId,
              project: x.reason,
              date: dateFns.format(y, 'YYYY-MM-DD')
            })).toArray()),
            headers: {
              'Authorization': 'Bearer ' + getApiConfig().apiToken,
              'Content-Type': 'application/json;charset=utf-8'
            }
          })) || Observable.of(null),
          (x.changes.size > 0 && Observable.ajax({
            url: `${getApiConfig().apiHost}/staffing?employee=eq.${x.employeeId}&date=in.${x.changes.map((y) => dateFns.format(y, 'YYYY-MM-DD')).join()}`,
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
            url: `${getApiConfig().apiHost}/staffing?employee=eq.${x.employeeId}&date=in.${x.removes.map((y) => dateFns.format(y, 'YYYY-MM-DD')).join()}`,
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + getApiConfig().apiToken
            }
          })) || Observable.of(null)
        ))
        .mergeMap(() => Observable.zip(fetchAbsenceAsync(), fetchStaffingAsync()))
        .flatMap((x) => ([loadAbsence(x[0]), loadStaffing(x[1])]));

export default combineEpics(
  fetchAbsenceReasonsEpic,
  fetchHolidaysEpic,
  fetchEmployeesEpic,
  fetchStaffingEpic,
  fetchAbsenceEpic,
  updateAbsenceEpic
);
