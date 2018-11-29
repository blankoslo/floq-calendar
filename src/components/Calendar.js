import React from 'react';
import { Range, List } from 'immutable';
import dateFns from 'date-fns';
import nbLocale from 'date-fns/locale/nb';

import { getCurrentAbsenceUpdates } from '../selectors';

import CalendarDate from './Date';

const emojis = ['', '', '', '🐣', '', '', '☀️', '', '', '', '', '🎄']
const daysOfWeek = ['ma', 'ti', 'on', 'to', 'fr'];

class Calendar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      startDate: undefined,
      endDate: undefined,
      selected: [],
    }
  }

  componentDidUpdate(prev) {
    if (this.props.currentEmployee && this.props.absence !== prev.absence) {
      if (this.props.absence !== this.props.originalAbsence) {
        const currentAbsenceUpdates = getCurrentAbsenceUpdates(
          this.props.currentEmployee,
          this.props.originalAbsence,
          this.props.absence,
        );
        this.props.updateAbsence(currentAbsenceUpdates, this.props.currentEmployee.id);
      }
    }
  }

  render() {
    return (
      <div className='year-calendar'>
        {Range(0, 12).map(month => {
          const firstDateOfMonth = new Date(this.props.year, month, 1);
          return (
            <div
              key={`${this.props.year}-${month}`}
              className='month'
            >
              <h4 className='month-header'>
                {this.getMonthText(firstDateOfMonth)} {emojis[month]}
              </h4>
              <div className='calendar'>
                <div className='calendar-header'>
                  {daysOfWeek.map((x) =>
                    <div className='calendar-header-day' key={x}>{x}</div>
                  )}
                </div>
                <div className='calendar-dates'>
                  {this.getMonthDates(firstDateOfMonth).map((date, i) => {
                    const dateString = this.props.year + '-' + (month + 1) + '-' + dateFns.getDate(date);

                    const isClicked = dateFns.isEqual(date, this.state.startDate) ||
                      this.state.selected.find(d => dateFns.isEqual(d, date));

                    return (
                      <CalendarDate
                        key={dateString + '-' + i}
                        date={date}
                        events={this.props.currentEvents.get(dateString)}
                        clicked={isClicked}
                        clickDate={this.clickDate}
                        hoverDate={this.hoverDate}
                        stopHoverDate={this.stopHoverDate}
                        absenceReasons={this.props.absenceReasons}
                        showAbsenceReasonContainer={dateFns.isEqual(date, this.state.endDate)}
                        saveAbsence={this.saveAbsence}
                        removeAbsence={this.removeAbsence}
                        cancel={this.cancel}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  clickDate = (date) => {
    if (!this.state.startDate) {
      this.selectStartDate(date);
    }
    else {
      if (dateFns.isBefore(date, this.state.startDate)) {
        this.selectStartDate(date);
      }
      else {
        this.selectEndDate(date);
      }
    }
  }

  hoverDate = (date) => {
    if (this.state.startDate && !this.state.endDate &&
      (dateFns.isAfter(date, this.state.startDate) || dateFns.isEqual(date, this.state.startDate))) {
      this.setState({
        selected: dateFns.eachDay(
          this.state.startDate,
          date
        )
      });
    }
  }

  stopHoverDate = () => {
    if (!this.state.endDate) {
      this.setState({ selected: [] });
    }
  }

  selectStartDate = (date) => {
    this.setState({ startDate: date });
  }

  selectEndDate = (date) => {
    this.setState({ endDate: date });
    this.props.openLayover();
  }

  saveAbsence = (reason) => {
    this.props.closeLayover();

    this.state.selected
      .filter(date => !this.props.currentEvents
        .get(dateFns.format(date, 'YYYY-M-D'), List()).some((x) => x.eventClassName === 'holiday')
        && !dateFns.isWeekend(date))
      .forEach(date => this.props.addAbsence(this.props.currentEmployee.id, date, reason));

    this.setState({ startDate: undefined, endDate: undefined, selected: [] });
  }

  removeAbsence = () => {
    this.props.closeLayover();

    this.state.selected
      .filter(date => !this.props.currentEvents
        .get(dateFns.format(date, 'YYYY-M-D'), List()).some((x) => x.eventClassName === 'holiday')
        && !dateFns.isWeekend(date))
      .forEach(date => this.props.removeAbsence(this.props.currentEmployee.id, date));

    this.setState({ startDate: undefined, endDate: undefined, selected: [] });
  }

  cancel = () => {
    this.props.closeLayover();
    this.setState({ startDate: undefined, endDate: undefined, selected: [] });
  }

  getMonthText = (date) => {
    return dateFns.format(date, 'MMMM', { locale: nbLocale });
  }

  getMonthDates = (firstDateOfMonth) => {
    const dates = [];

    Range(0, this.getPadDays(dateFns.getISODay(firstDateOfMonth)))
      .forEach(() => dates.push(null));

    const lastDayOfMonth = dateFns.lastDayOfMonth(firstDateOfMonth);

    dateFns.eachDay(
      firstDateOfMonth,
      lastDayOfMonth
    ).map(date => dates.push(date));

    Range(0, this.getPadDaysEnd(dateFns.getISODay(lastDayOfMonth)))
      .forEach(() => dates.push(null));

    return dates;
  }

  getPadDays = (dayNumber) => {
    if (dayNumber === 1 || dayNumber === 6 || dayNumber === 7) {
      return 0;
    }
    return dayNumber - 1;
  }

  getPadDaysEnd = (dayNumber) => {
    if (dayNumber === 5 || dayNumber === 6 || dayNumber === 7) {
      return 0;
    }
    return 5 - dayNumber;
  }
}

export default Calendar;
