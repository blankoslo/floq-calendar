import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import dateFns from 'date-fns';
import getYear from 'date-fns/get_year';
import isFuture from 'date-fns/is_future';
import isToday from 'date-fns/is_today';
import format from 'date-fns/format';
import nbLocale from 'date-fns/locale/nb';

const config = {
    loggedInUserEmail: window.userEmail
};

const notPlannableAbsenceReasons = ['SYK1000', 'SYK1002'];

export const reasonToEventGroup = (reason) => {
  switch (reason) {
    case 'FER1000':
      return 'vacation';
    case 'SYK1000':
    case 'SYK1001':
    case 'SYK1002':
      return 'sick';
    case 'PER1000':
    case 'PER1002':
      return 'leave';
    case 'PER1001':
      return 'leave-without-pay';
    case 'AVS':
      return 'avs';
    default:
      return reason;
  }
};

export const reasonToEventName = (reason) => {
  switch (reason) {
    case 'FER1000':
      return 'Ferie';
    case 'SYK1000':
      return 'Egenmelding';
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

export const monthToRef = (number) => {
  switch (number) {
    case 0: return 'jan';
    case 1: return 'feb';
    case 2: return 'mars';
    case 3: return 'april';
    case 4: return 'mai';
    case 5: return 'juni';
    case 6: return 'juli';
    case 7: return 'aug';
    case 8: return 'sept';
    case 9: return 'okt';
    case 10: return 'nov';
    default: return 'des';
  }
};

export const dateRangeToDateString = (array) => {
  if (array.length < 1) {
    return '';
  }
  else if (array.length === 1) {
    return format(array[0], 'D. MMMM', { locale: nbLocale });
  }
  else if (format(array[0], 'M') === format(array[array.length - 1], 'M')) {
    return format(array[0], 'D') + '. til ' + format(array[array.length - 1], 'D. MMMM', { locale: nbLocale });
  }
  return format(array[0], 'D. MMMM', { locale: nbLocale }) + ' til ' + format(array[array.length - 1], 'D. MMMM', { locale: nbLocale });
}

export const currentEmployee = createSelector(
  (state) => state.currentEmployee,
  (state) => state.employees,
  (currentEmployee, employees) => {
    return employees.find((x) => x.id === currentEmployee)
      || employees.find((x) => x.name.toLowerCase().indexOf(currentEmployee.toLowerCase()) !== -1)
      || employees.first()
  }
);

export const loggedInEmployee = (state) => {
    return state.employees.find(employee => employee.email === config.loggedInUserEmail);
}

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

export const pastAbsence = createSelector(
  currentEmployee,
  (state) => state.currentYear,
  (state) => state.absenceSpent,
  absenceReasonMap,
  (currentEmployee, currentYear, pastAbsence, absenceReasons) => (
    pastAbsence.get(currentEmployee && currentEmployee.id, List())
      .filter((x) => getYear(x.date) === currentYear)
      .map((x) => [dateFns.format(x.date, 'YYYY-M-D'), List([{
        date: x.date,
        minutes: x.minutes,
        eventId: x.reason,
        event: absenceReasons.get(x.reason),
        eventClassName: x.minutes < 450 ? reasonToEventGroup(x.reason) + '-partial' : reasonToEventGroup(x.reason)
      }])])
  )
);

export const plannableAbsenceReasons = createSelector(
  (state) => state.absenceReasons,
  (absenceReasons) => (
    absenceReasons.filter(reason => !notPlannableAbsenceReasons.find(id => reason.id === id))
  ));

export const absenceReasonGroups = createSelector(
  absenceReasonMap,
  (absenceReasons) => (
    Map(absenceReasons.reduce((acc, value, key) => {
      const item = { [key]: reasonToEventName(key) };
      const group = reasonToEventGroup(key);
      return {
        ...acc,
        [group]: acc[group] ? acc[group].merge(item) : Map(item)
      }
    }, {}))
  ));

export const currentEvents = createSelector(
  currentEmployee,
  holidays,
  (state) => state.absence,
  absenceReasonMap,
  pastAbsence,
  (currentEmployee, holidays, absence, absenceReasons, pastAbsence) => {

    const futureAbsence = absence.get(currentEmployee && currentEmployee.id, Map())
      .entrySeq()
      .filter(([k, v]) => isFuture(v.get(0).date) || isToday(v.get(0).date))
      .map(([k, v]) => [k, v.map((y) => ({
        date: y.date,
        eventId: y.reason,
        event: absenceReasons.get(y.reason),
        eventClassName: reasonToEventGroup(y.reason)
      }))]);

    return (
      Map(holidays
        .concat(pastAbsence)
        .concat(futureAbsence)
      )
    );
  }
);
