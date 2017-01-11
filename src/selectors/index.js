import { createSelector } from 'reselect';
import { Map } from 'immutable';

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
              .some((y) => y.date.isSame(x.date)))
      .map((x) => x.date).toList(),
    changes: currentEmployee && absence.get(currentEmployee.id, Map())
      .valueSeq().flatten()
      .filter((x) => originalAbsence.get(currentEmployee.id, Map())
              .valueSeq().flatten()
              .some((y) => y.date.isSame(x.date) && y.reason !== x.reason))
      .map((x) => x.date).toList(),
    removes: currentEmployee && originalAbsence.get(currentEmployee.id, Map())
      .valueSeq().flatten()
      .filter((x) => !absence.get(currentEmployee.id, Map())
              .valueSeq().flatten()
              .some((y) => y.date.isSame(x.date)))
      .map((x) => x.date).toList()
  });

export const absenceReasonMap = createSelector(
  (state) => state.absenceReasons,
  (absenceReasons) => Map(absenceReasons.map((x) => [x.id, x.name]))
);

export const currentEvents = createSelector(
  currentEmployee,
  (state) => state.currentYear,
  (state) => state.holidays,
  (state) => state.absence,
  absenceReasonMap,
  (currentEmployee, currentYear, holidays, absence, absenceReasons) =>
    holidays.map((x) => ({
      date: x.date,
      event: x.name,
      eventClassName: 'holiday'
    })).concat(
      absence.get(currentEmployee && currentEmployee.id, Map())
        .valueSeq().flatten()
        .map((x) => ({
          date: x.date,
          event: absenceReasons.get(x.reason),
          eventClassName: reasonToEventClassName(x.reason)
        }))
    ).filter((x) => x.date.year() === currentYear)
);
