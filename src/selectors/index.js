import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import dateFns from 'date-fns';
import getYear from 'date-fns/get_year';

export const reasonToEventClassName = (reason) => {
  switch (reason) {
    case 'FER1000':
      return 'vacation';
    case 'SYK1001':
      return 'sick';
    case 'SYK1002':
      return 'sick-child';
    case 'PER1000':
      return 'leave-with-pay';
    case 'PER1002':
      return 'parent-leave';
    case 'PER1001':
      return 'leave-without-pay';
    default:
      return 'leave';
  }
};

export const reasonToEventName = (reason) => {
  switch (reason) {
    case 'FER1000':
      return 'Ferie';
    case 'SYK1001':
      return 'Sykemelding';
    case 'SYK1002':
      return 'Sykt barn';
    case 'PER1000':
      return 'Permisjon m/lønn';
    case 'PER1002':
      return 'Foreldrepermisjon';
    case 'PER1001':
      return 'Permisjon u/lønn';
    case 'AVS':
      return 'Avspasering';
    default:
      return reason;
  }
};

export const currentEmployee = createSelector(
  (state) => state.currentEmployee,
  (state) => state.employees,
  (currentEmployee, employees) => {
    return employees.find((x) => x.id === currentEmployee)
      || employees.find((x) => x.name.toLowerCase().indexOf(currentEmployee.toLowerCase()) !== -1)
      || employees.first()
  }
);

export const getCurrentAbsenceUpdates =
  (currentEmployee, originalAbsence, absence) => ({
    adds: currentEmployee && absence.get(currentEmployee.id, Map())
      .valueSeq().flatten()
      .filter((x) => !originalAbsence.get(currentEmployee.id, Map())
        .valueSeq().flatten()
        .some((y) => dateFns.isSameDay(y.date, x.date)))
      .toList(),
    changes: currentEmployee && absence.get(currentEmployee.id, Map())
      .valueSeq().flatten()
      .filter((x) => originalAbsence.get(currentEmployee.id, Map())
        .valueSeq().flatten()
        .some((y) => dateFns.isSameDay(y.date, x.date) &&
          y.reason !== x.reason))
      .toList(),
    removes: currentEmployee && originalAbsence.get(currentEmployee.id, Map())
      .valueSeq().flatten()
      .filter((x) => !absence.get(currentEmployee.id, Map())
        .valueSeq().flatten()
        .some((y) => dateFns.isSameDay(y.date, x.date)))
      .toList()
  });

export const absenceReasonMap = createSelector(
  (state) => state.absenceReasons,
  (absenceReasons) => Map(absenceReasons.map((x) => [x.id, x.name]))
);

export const holidays = createSelector(
  (state) => state.currentYear,
  (state) => state.holidays,
  (currentYear, holidays) => (
    holidays
      .filter((x) => getYear(x.date) === currentYear)
      .map((x) => [dateFns.format(x.date, 'YYYY-M-D'), List([{
        date: x.date,
        event: x.name,
        eventClassName: 'holiday'
      }])])
  )
);

export const currentEvents = createSelector(
  currentEmployee,
  (state) => state.currentYear,
  holidays,
  (state) => state.absence,
  absenceReasonMap,
  (currentEmployee, currentYear, holidays, absence, absenceReasons) =>
    Map(holidays.concat(
      absence.get(currentEmployee && currentEmployee.id, Map())
        .entrySeq()
        .filter(([k, v]) => k.startsWith(currentYear.toString()))
        .map(([k, v]) => [k, v.map((y) => ({
          date: y.date,
          event: absenceReasons.get(y.reason),
          eventClassName: reasonToEventClassName(y.reason)
        }))])
    ))
);
