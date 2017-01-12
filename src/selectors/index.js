import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import dateFns from 'date-fns';
import getYear from 'date-fns/get_year';

export const reasonToEventClassName = (reason) =>{
  switch (reason) {
  case 'FER1000':
    return 'vacation';
  case 'SYK1001':
    return 'sick';
  case 'SYK1002':
    return 'sick-child';
  case 'PER1000':
    return 'leave-with-pay';
  case 'PER1001':
  default:
    return 'leave';
  }
};

export const currentEmployee = createSelector(
  (state) => state.currentEmployee,
  (state) => state.employees,
  (currentEmployee, employees) =>
    employees.find((x) => x.id === currentEmployee) || employees.first()
);

export const getCurrentAbsenceUpdates =
  (currentEmployee, originalAbsence, absence) => ({
    adds: currentEmployee && absence.get(currentEmployee.id, Map())
      .valueSeq().flatten()
      .filter((x) => !originalAbsence.get(currentEmployee.id, Map())
              .valueSeq().flatten()
              .some((y) => dateFns.isSameDay(y.date, x.date)))
      .map((x) => x.date).toList(),
    changes: currentEmployee && absence.get(currentEmployee.id, Map())
      .valueSeq().flatten()
      .filter((x) => originalAbsence.get(currentEmployee.id, Map())
              .valueSeq().flatten()
              .some((y) => dateFns.isSameDay(y.date, x.date) &&
                    y.reason !== x.reason))
      .map((x) => x.date).toList(),
    removes: currentEmployee && originalAbsence.get(currentEmployee.id, Map())
      .valueSeq().flatten()
      .filter((x) => !absence.get(currentEmployee.id, Map())
              .valueSeq().flatten()
              .some((y) => dateFns.isSameDay(y.date, x.date)))
      .map((x) => x.date).toList()
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
