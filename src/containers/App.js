import React from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import moment from 'moment';

import {
  fetchAbsenceReasons, fetchEmployees, fetchHolidays, fetchStaffing,
  fetchAbsence, updateAbsence
} from '../epics';

import {
  selectCurrentEmployee, setCurrentYear, selectPreviousYear, selectNextYear,
  openAbsenceReasonTool, closeAbsenceReasonTool, selectAbsenceReason,
  addAbsence, removeAbsence
} from '../actions';

import {
  currentEmployee, currentAbsenceUpdates, currentEvents,
  reasonToEventClassName
} from '../selectors';

import YearCalendar from '../components/YearCalendar';

class App extends React.Component {
  componentWillMount() {
    this.props.fetchHolidays();
    this.props.fetchEmployees();
    this.props.fetchAbsenceReasons();
    this.props.fetchStaffing();
    this.props.fetchAbsence();

    this.props.setCurrentYear(moment().year());
  }

  componentDidMount() {
    setTimeout(() => {
      const dateId = moment().format('YYYY-M');
      const e = document.getElementById(dateId);
      if (e) {
        e.scrollIntoView(true);
      }
    }, 0);
  }

  handleSetEmployee = ({ value }) => {
    this.props.selectCurrentEmployee(value);
  }

  handleSetDate = (date) => {
    const reason = this.props.absenceReasonTool.value;
    if (this.props.absence.get(this.props.currentEmployee.id)
            .some((x) => x.date.isSame(date) && x.reason === reason)) {
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
        this.props.updateAbsence(
          this.props.currentEmployee.id,
          this.props.absenceReasonTool.value,
          this.props.currentAbsenceUpdates.adds,
          this.props.currentAbsenceUpdates.changes,
          this.props.currentAbsenceUpdates.removes
        );
      }
    } else {
      this.props.openAbsenceReasonTool();
    }
  }

  render() {
    const absenceReasonMenu = (
      <div>
        { this.props.absenceReasons.map((x) => (
            <MenuItem
              key={x.id}
              onClick={() => this.props.selectAbsenceReason(x.id)}
              secondaryText=''
            >
              <div className={`legend event-${reasonToEventClassName(x.id)}`}>&nbsp;</div>
              {x.name}
            </MenuItem>
          ))
        }
      </div>
    );
    const employees = this.props.employees
                          .map((x) => ({ text: x.name, value: x.id }))
                          .toArray();
    const absenceReasonToolLabel =
      this.props.absenceReasonTool.active
      ? 'Save'
      : (this.props.absenceReasonTool.open ? 'Close' : 'Edit');
    return (
      <MuiThemeProvider>
        <div>
          <Toolbar
            style={{ position: 'fixed', width: '100%' }}
          >
            <ToolbarGroup firstChild={true}>
              <IconButton
                iconClassName='material-icons'
                onClick={() => this.props.selectPreviousYear()}
              >
                arrow_back
              </IconButton>
              <ToolbarTitle
                text={this.props.currentYear.toString()}
                style={{ padding: '0rem', color: '#000' }}
              />
              <IconButton
                iconClassName='material-icons'
                onClick={() => this.props.selectNextYear()}
                touch={false}
              >
                arrow_forward
              </IconButton>
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
              <AutoComplete
                id='employeeSelector'
                dataSource={employees}
                filter={AutoComplete.fuzzyFilter}
                searchText={(this.props.currentEmployee
                          && this.props.currentEmployee.name) || ''}
                openOnFocus={true}
                onNewRequest={this.handleSetEmployee}
              />
              {/* <IconButton
                  iconClassName='material-icons'
                  >
                  zoom_out
                  </IconButton>
                  <IconButton
                  iconClassName='material-icons'
                  >
                  zoom_in
                  </IconButton> */}
              <RaisedButton
                label={absenceReasonToolLabel}
                primary={this.props.absenceReasonTool.active}
                onClick={this.handleSetAbsenceReasonTool}
              />
            </ToolbarGroup>
          </Toolbar>
          <div className='main'>
            <YearCalendar
              year={this.props.currentYear}
              events={this.props.currentEvents}
              editMode={this.props.absenceReasonTool.active}
              onSubmit={this.handleSetDate}
            />
          </div>
          <Drawer
            open={this.props.absenceReasonTool.open}
            openSecondary={true}
            containerStyle={{height: 'calc(100% - 8.6rem)', top: '8.6rem' }}
            width={300}
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
  currentAbsenceUpdates: currentAbsenceUpdates(state),
  currentYear: state.currentYear,
  employees: state.employees,
  absenceReasonTool: state.absenceReasonTool,
  absenceReasons: state.absenceReasons,
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
  fetchStaffing,
  fetchAbsence,
  updateAbsence
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
