import { createSelector } from 'reselect';
import { List } from 'immutable';

export const reasonToEventClassName = (reason) =>{
  switch (reason) {
  case 'FER1000':
    return 'vacation';
  case 'SYK1001':
  case 'SYK1002':
    return 'sick';
  case 'PER1000':
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

export const getCurrentAbsenceUpdates = (currentEmployee, originalAbsence, absence) => ({
  adds: currentEmployee && absence.get(currentEmployee.id, List())
    .filter((x) => !originalAbsence.get(currentEmployee.id, List())
            .some((y) => y.date.isSame(x.date)))
    .map((x) => x.date),
  changes: currentEmployee && absence.get(currentEmployee.id, List())
    .filter((x) => originalAbsence.get(currentEmployee.id, List())
            .some((y) => y.date.isSame(x.date)
                  && y.reason !== x.reason))
    .map((x) => x.date),
  removes: currentEmployee && originalAbsence.get(currentEmployee.id, List())
    .filter((x) => !absence.get(currentEmployee.id, List())
            .some((y) => y.date.isSame(x.date)))
    .map((x) => x.date)
});

export const currentEvents = createSelector(
  currentEmployee,
  (state) => state.currentYear,
  (state) => state.holidays,
  (state) => state.absence,
  (currentEmployee, currentYear, holidays, absence) =>
    holidays.map((x) => ({
      date: x.date,
      event: x.name,
      eventClassName: 'holiday'
    })).concat(
      absence.get(currentEmployee && currentEmployee.id, List())
        .map((x) => ({
          date: x.date,
          event: x.reason,
          eventClassName: reasonToEventClassName(x.reason)
        }))
    ).filter((x) => x.date.year() === currentYear)
);
