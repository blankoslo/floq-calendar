import React from 'react';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import dateFns from 'date-fns';
import getYear from 'date-fns/get_year';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  fontFamily: 'museo-sans'
});

import {
  fetchAbsenceReasons, fetchEmployees, fetchHolidays, fetchAbsence,
  updateAbsence
} from '../epics';

import {
  selectCurrentEmployee, setCurrentYear,
  selectPreviousYear, selectNextYear,
  openAbsenceReasonTool, closeAbsenceReasonTool, selectAbsenceReason,
  addAbsence, removeAbsence
} from '../actions';

import {
  currentEmployee, currentEvents, getCurrentAbsenceUpdates
} from '../selectors';

import YearCalendar from '../components/YearCalendar';
import Header from '../components/Header';
import AbsenceInfo from '../components/AbsenceInfo';

class App extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      selectDatesMode: false,
    }
  }

  componentWillMount() {
    this.props.fetchHolidays();
    this.props.fetchEmployees();
    this.props.fetchAbsenceReasons();
    this.props.fetchAbsence();

    const now = new Date();
    this.props.setCurrentYear(getYear(now));
  }

  handleSetEmployee = ({ value }) => {
    this.props.selectCurrentEmployee(value);
  }

  addDate = (date) => {
    this.setState({ selectDatesMode: true });

    if (this.props.absence.get(this.props.currentEmployee.id, Map())
      .get(dateFns.format(date, 'YYYY-M-D'), List()).size > 0) {
      this.props.removeAbsence(this.props.currentEmployee.id, date);
    } else {
      this.props.addAbsence(this.props.currentEmployee.id, date, '');
    }
  }

  saveAbsence = (reason) => {
    const currentAbsenceUpdates = getCurrentAbsenceUpdates(
      this.props.currentEmployee,
      this.props.originalAbsence,
      this.props.absence
    );
    this.props.updateAbsence(
      this.props.currentEmployee.id,
      reason,
      currentAbsenceUpdates.adds,
      currentAbsenceUpdates.changes,
      currentAbsenceUpdates.removes
    );
    this.setState({ selectDatesMode: false });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id='outer'>
          <Header
            absenceReasons={this.props.absenceReasons}
          />
          <div id='container'>
            <div id='main'>
              <AbsenceInfo
                currentEmployee={this.props.currentEmployee}
                year={this.props.currentYear}
                prevYear={() => this.props.selectPreviousYear()}
                nextYear={() => this.props.selectNextYear(1)}
              />
              <YearCalendar
                year={this.props.currentYear}
                selectedMonth={this.props.currentMonth}
                events={this.props.currentEvents}
                addDate={this.addDate}
                updateCalendar={this.saveAbsence}
                absenceReasons={this.props.absenceReasons}
              />
            </div>
            <div className={this.state.selectDatesMode ? 'select-dates-mode' : ''} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  currentEmployee: currentEmployee(state),
  currentYear: state.currentYear,
  employees: state.employees,
  absenceReasonTool: state.absenceReasonTool,
  absenceReasons: state.absenceReasons,
  originalAbsence: state.originalAbsence,
  absence: state.absence,
  currentEvents: currentEvents(state)
});

const mapDispatchToProps = {
  selectCurrentEmployee,
  setCurrentYear,
  selectPreviousYear,
  selectNextYear,
  openAbsenceReasonTool, //TODO remove
  closeAbsenceReasonTool, //TODO remove
  selectAbsenceReason,
  addAbsence,
  removeAbsence,
  fetchAbsenceReasons,
  fetchHolidays,
  fetchEmployees,
  fetchAbsence,
  updateAbsence
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
