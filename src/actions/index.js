export const SELECT_CURRENT_EMPLOYEE = 'SELECT_CURRENT_EMPLOYEE';
export const selectCurrentEmployee = (id) => ({
  type: SELECT_CURRENT_EMPLOYEE,
  id
});

export const SET_CURRENT_YEAR = 'SET_CURRENT_YEAR';
export const setCurrentYear = (currentYear) => ({
  type: SET_CURRENT_YEAR,
  currentYear
});

export const SELECT_PREVIOUS_YEAR = 'SELECT_PREVIOUS_YEAR';
export const selectPreviousYear = () => ({
  type: SELECT_PREVIOUS_YEAR
});

export const SELECT_NEXT_YEAR = 'SELECT_NEXT_YEAR';
export const selectNextYear = () => ({
  type: SELECT_NEXT_YEAR
});

export const LOAD_ABSENCE_REASONS = 'LOAD_ABSENCE_REASONS';
export const loadAbsenceReasons = (absenceReasons) => ({
  type: LOAD_ABSENCE_REASONS,
  absenceReasons
});

export const LOAD_HOLIDAYS = 'LOAD_HOLIDAYS';
export const loadHolidays = (holidays) => ({
  type: LOAD_HOLIDAYS,
  holidays
});

export const LOAD_EMPLOYEES = 'LOAD_EMPLOYEES';
export const loadEmployees = (employees) => ({
  type: LOAD_EMPLOYEES,
  employees
});

export const LOAD_ABSENCE = 'LOAD_ABSENCE';
export const loadAbsence = (absence) => ({
  type: LOAD_ABSENCE,
  absence
});

export const LOAD_HOLIDAY_DAYS = 'LOAD_HOLIDAY_DAYS';
export const loadHolidayDays = (days) => ({
  type: LOAD_HOLIDAY_DAYS,
  days
});

export const ADD_ABSENCE = 'ADD_ABSENCE';
export const addAbsence = (employeeId, date, reason) => ({
  type: ADD_ABSENCE,
  employeeId,
  date,
  reason
});

export const REMOVE_ABSENCE = 'REMOVE_ABSENCE';
export const removeAbsence = (employeeId, date) => ({
  type: REMOVE_ABSENCE,
  employeeId,
  date
});

export const LOAD_ABSENCE_SPENT = 'LOAD_ABSENCE_SPENT';
export const loadAbsenceSpent = (absence) => ({
  type: LOAD_ABSENCE_SPENT,
  absence
});