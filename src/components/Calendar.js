import React from 'react';
import { Map, Range } from 'immutable';
import classNames from 'classnames';
import dateFns from 'date-fns';
import getISODay from 'date-fns/get_iso_day';
import getDaysInMonth from 'date-fns/get_days_in_month';
import isWeekend from 'date-fns/is_weekend';
import nbLocale from 'date-fns/locale/nb';

export const getDayText = (startOfMonth, x, y) => {
  const startOfMonthDay = getISODay(startOfMonth) - 1;
  const daysInMonth = getDaysInMonth(startOfMonth);
  const day = x + y * 7 - startOfMonthDay + 1;
  return (day > 0 && day <= daysInMonth) ? day.toString() : '';
};

class CalendarDate extends React.PureComponent {
  render() {
    const props = this.props;
    const day = props.day &&
      new Date(props.year, props.month - 1, parseInt(props.day, 10));
    const weekend = props.day && isWeekend(day);
    const holiday = props.events &&
      props.events.some((x) => x.eventClassName === 'holiday');
    const eventClassNames = props.events && Map(props.events
      .map((x) => [`event-${x.eventClassName}`, true]))
      .toObject();
    const editable = props.day
      && !weekend
      && !holiday
      && props.editMode;
    const dayClassNames = classNames({
      ...eventClassNames,
      'event-weekend': weekend,
      'month-calendar-event': true
    });
    const dateClassNames = classNames({
      ...eventClassNames,
      date: true,
      'event-weekend': weekend,
      'date-disabled': !props.day,
      'date-edit-mode': editable
    });
    return (
      <div
        className={dateClassNames}
        onClick={() => editable && props.onSubmit(day)}
      >
        <div className='month-calendar-day-name'>
          {day && dateFns.format(day, 'ddd', { locale: nbLocale })}
        </div>
        <div
          className='month-calendar-day'
          title={props.events && props.events.map((x) => x.event).join()}
        >
          {props.day}
        </div>
        <div className={dayClassNames}>
          {props.events && props.events.map((x) => x.event).join()}
        </div>
      </div>
    );
  }
}

const Calendar = (props) => {
  const startOfMonth = new Date(props.year, props.month - 1, 1);
  const getDay = (dow, day) =>
    getDayText(startOfMonth, props.daysOfWeek.indexOf(dow), day);
  const calendarClassNames = classNames({
    [props.className]: true
  });
  return (
    <div className={calendarClassNames}>
      <div className='calendar-header'>
        {props.daysOfWeek.map((x) => <div key={x}>{x}</div>)}
      </div>
      <div className='calendar-dates'>
        {Range(0, 6).map((x) => props.daysOfWeek
          .map((y) => {
            const day = getDay(y, x);
            const dateText = props.year + '-' +
              props.month + '-' +
              day;
            return (
              <CalendarDate
                key={dateText + '-' + x + '-' + y}
                year={props.year}
                month={props.month}
                day={day}
                editMode={props.editMode}
                events={props.events.get(dateText)}
                onSubmit={props.onSubmit}
              />
            );
          }))
        }
      </div>
    </div>
  );
};

export default Calendar;
