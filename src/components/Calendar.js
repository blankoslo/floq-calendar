import React from 'react';
import getISODay from 'date-fns/get_iso_day';
import getDaysInMonth from 'date-fns/get_days_in_month';
import CalendarDate from './CalendarDate';
import { Range } from 'immutable';

const daysOfWeek = ['ma', 'ti', 'on', 'to', 'fr'];

export default class Calendar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      startOfMonth: new Date(this.props.year, this.props.month - 1, 1),
      selectedDays: {},
      isMouseDown: false,
      lastSelectedDate: undefined,
    }
  }

  render() {
    return (
      <div className={'calendar'}>
        <div className='calendar-header'>
          {daysOfWeek.map((x) =>
            <div className='calendar-header-day' key={x}>{x}</div>
          )}
        </div>
        <div className='calendar-dates'>
          {this.getDates().map((date, i) =>
            <CalendarDate
              key={date.dateString + '-' + i}
              day={date.dayInMonth}
              date={date.date}
              events={this.props.events.get(date.dateString)}
              absenceReasons={this.props.absenceReasons}
              addDate={this.addDate}
              saveAbsence={this.saveAbsence}
              isMouseDown={this.state.isMouseDown}
              startSelect={this.startSelect}
              stopSelect={this.stopSelect}
              clicked={date.dayInMonth in this.state.selectedDays}
              showAbsenceReasonContainer={this.state.lastSelectedDate === date.dayInMonth}
              cancel={this.cancel}
            />
          )}
        </div>
      </div>
    );
  }

  startSelect = () => {
    this.setState({ isMouseDown: true });
  }

  addDate = (date, day) => {
    if (!this.state.selectedDays[day]) {
      this.setState({
        selectedDays: {
          ...this.state.selectedDays,
          [day]: date
        }
      });
      this.props.addDate(date);
    }
  }

  stopSelect = (day) => {
    this.setState({ isMouseDown: false, lastSelectedDate: day });
    this.props.openLayover();
  }

  saveAbsence = (reason) => {
    this.setState({ selectedDays: {}, lastSelectedDate: undefined });
    this.props.updateCalendar(reason);
  }

  cancel = () => {
    this.props.removeDates(Object.values(this.state.selectedDays));
    this.setState({ selectedDays: {}, lastSelectedDate: undefined });
  }

  getDayInMonth = (x, y) => {
    const startOfMonthDay = getISODay(this.state.startOfMonth) - 1;
    const daysInMonth = getDaysInMonth(this.state.startOfMonth);
    const day = x + y * 7 - startOfMonthDay + 1;
    return (day > 0 && day <= daysInMonth) ? day.toString() : '';
  }

  getDates = () => {
    return Range(0, 6).reduce((acc, weekInMonth) => {
      // Empty is a variable to check whether the whole week only consist of non-existant dates,
      // If so, we just skip the whole week
      let empty = true;
      const week = [];

      daysOfWeek.map(weekday => {
        const day = this.getDayInMonth(daysOfWeek.indexOf(weekday), weekInMonth);
        if (day !== '') {
          empty = false;
        }
        week.push({
          dayInMonth: day,
          dateString: this.props.year + '-' + this.props.month + '-' + day,
          date: new Date(this.props.year, this.props.month - 1, parseInt(day, 10)),
        });
      })
      if (empty) {
        return acc;
      }
      return acc.concat(week);
    }, []);
  }
}