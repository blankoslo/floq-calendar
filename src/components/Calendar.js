import React from 'react';
import getISODay from 'date-fns/get_iso_day';
import getDaysInMonth from 'date-fns/get_days_in_month';
import CalendarDate from './CalendarDate';

const daysOfWeek = ['ma', 'ti', 'on', 'to', 'fr'];
const weeksInMonth = [0, 1, 2, 3, 4, 5];

export default class Calendar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      startOfMonth: new Date(this.props.year, this.props.month - 1, 1),
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
              key={date.date + '-' + i}
              year={this.props.year}
              month={this.props.month}
              day={date.dayInMonth}
              events={this.props.events.get(date.date)}
              absenceReasons={this.props.absenceReasons}
              addDate={this.props.addDate}
              updateCalendar={this.props.updateCalendar}
            />
          )}
        </div>
      </div>
    );
  }

  getDate = (x, y) => {
    const startOfMonthDay = getISODay(this.state.startOfMonth) - 1;
    const daysInMonth = getDaysInMonth(this.state.startOfMonth);
    const day = x + y * 7 - startOfMonthDay + 1;
    return (day > 0 && day <= daysInMonth) ? day.toString() : '';
  }

  getDates = () => {
    return weeksInMonth.reduce((acc, weekInMonth) => {
      // Empty is a variable to check whether the whole week only consist of non-existant dates,
      // If so, we just skip the whole week
      let empty = true;
      const week = [];

      daysOfWeek.map(weekday => {
        const day = this.getDate(daysOfWeek.indexOf(weekday), weekInMonth);
        if (day !== '') {
          empty = false;
        }
        week.push({
          dayInMonth: day,
          date: this.props.year + '-' + this.props.month + '-' + day
        });
      })
      if (empty) {
        return acc;
      }
      return acc.concat(week);
    }, []);
  }
}