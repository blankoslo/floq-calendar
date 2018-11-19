import React from 'react';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
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
  currentEmployee, currentEvents,
  reasonToEventClassName, getCurrentAbsenceUpdates
} from '../selectors';

import YearCalendar from '../components/YearCalendar';
import Header from '../components/Header';

class App extends React.PureComponent {
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

  handleSetDate = (date) => {
    const reason = this.props.absenceReasonTool.value;
    if (this.props.absence.get(this.props.currentEmployee.id, Map())
      .get(dateFns.format(date, 'YYYY-M-D'), List())
      .some((x) => x.reason === reason)) {
      this.props.removeAbsence(this.props.currentEmployee.id, date);
    } else {
      this.props.addAbsence(this.props.currentEmployee.id, date, reason);
    }
  }

  handleSetAbsenceReasonTool = () => {
    if (this.props.absenceReasonTool.active
      || this.props.absenceReasonTool.open) {
      this.props.closeAbsenceReasonTool();
      if (this.props.absenceReasonTool.active
        && this.props.currentEmployee.id
        && this.props.absenceReasonTool.value) {
        const currentAbsenceUpdates = getCurrentAbsenceUpdates(
          this.props.currentEmployee,
          this.props.originalAbsence,
          this.props.absence
        );
        this.props.updateAbsence(
          this.props.currentEmployee.id,
          this.props.absenceReasonTool.value,
          currentAbsenceUpdates.adds,
          currentAbsenceUpdates.changes,
          currentAbsenceUpdates.removes
        );
      }
    } else {
      this.props.openAbsenceReasonTool();
    }
  }

  handleSetCurrentYearMonth = (year, month) => {
    this.props.setCurrentYear(year);
    this.props.setCurrentMonth(month);
  }

  render() {
    const absenceReasonMenu = (
      <div>
        {this.props.absenceReasons.map((x) => (
          <MenuItem
            key={x.id}
            onClick={() => this.props.selectAbsenceReason(x.id)}
            secondaryText=''
          >
            <div className={`legend event-${reasonToEventClassName(x.id)}`}>
              &nbsp;
              </div>
            {x.name}
          </MenuItem>
        ))
        }
      </div>
    );
    const absenceReasonToolLabel =
      this.props.absenceReasonTool.active
        ? 'Save'
        : (this.props.absenceReasonTool.open ? 'Close' : 'Edit');

    
        /*console.log("Events: ");
        console.log(this.props.currentEvents.toJS());*/


    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id='outer'>
          <Header
            currentEmployee={this.props.currentEmployee}
            absenceReasonTool={this.props.absenceReasonTool.active}
            handleSetAbsenceReasonTool={this.handleSetAbsenceReasonTool}
            absenceReasonToolLabel={absenceReasonToolLabel}
            absenceReasons={this.props.absenceReasons}
          />
          <div id='container'>
            <div id='main'>
              <YearCalendar
                year={this.props.currentYear}
                onPrevYear={() => this.props.selectPreviousYear()}
                onNextYear={() => this.props.selectNextYear(1)}
                selectedMonth={this.props.currentMonth}
                events={this.props.currentEvents}
                editMode={this.props.absenceReasonTool.active}
                onSubmit={this.handleSetDate}
                absenceReasons={this.props.absenceReasons}
              />
            </div>
          </div>
          <Drawer
            className='absence-reason-tool-drawer'
            containerClassName='absence-reason-tool-drawer'
            open={this.props.absenceReasonTool.open}
            openSecondary={true}
          >
            {absenceReasonMenu}
          </Drawer>
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
  openAbsenceReasonTool,
  closeAbsenceReasonTool,
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
