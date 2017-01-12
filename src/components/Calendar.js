import React from 'react';
import { Map, List, Range } from 'immutable';
import moment from 'moment';
import classNames from 'classnames';

const isWeekend = (day) => day === 6 || day === 7;

export const getDayText = (startOfMonth, x, y) => {
  const startOfMonthDay = startOfMonth.isoWeekday() - 1;
  const daysInMonth = startOfMonth.daysInMonth();
  const day = x + y * 7 - startOfMonthDay + 1;
  return (day > 0 && day <= daysInMonth) ? day.toString() : '';
};

const CalendarDate = (props) => {
  const dateText = props.year + '-' +
                   props.month + '-' +
                   props.day;
  const day = props.day && moment(dateText, 'YYYY-M-D');
  const weekend = props.day && isWeekend(day.isoWeekday());
  const dayEvents = props.events.get(dateText, List());
  const holiday = dayEvents.some((x) => x.eventClassName === 'holiday');
  const dayEventClassNames = Map(dayEvents
    .map((x) => [`event-${x.eventClassName}`, true]))
    .toObject();
  const editable = props.day
                && !weekend
                && !holiday
                && props.editMode;
  const dayClassNames = classNames({
    ...dayEventClassNames,
    'month-calendar-event': true,
    'disabled': !props.day,
    'weekend': weekend,
    'edit-mode': editable
  });
  return (
    <td
      className={dayClassNames}
      onClick={() => editable && props.onSubmit(day)}
    >
      <div
        className='month-calendar-day'
        title={dayEvents.map((x) => x.event).join()}
      >
        {props.day}
      </div>
      <div className={dayClassNames}>
        {dayEvents.map((x) => x.event).join()}
      </div>
    </td>
  );
};

const Calendar = (props) => {
  const startOfMonth = moment(props.year + '-' + props.month, 'YYYY-M');
  const getDay = (dow, day) =>
    getDayText(startOfMonth, props.daysOfWeek.indexOf(dow), day);
  const calendarClassNames = classNames({
    [props.className]: true,
    'edit-mode': props.editMode
  });
  return (
    <table className={calendarClassNames}>
      <thead>
        <tr>
          {props.daysOfWeek.map((x) => <th key={x}>{x}</th>)}
        </tr>
      </thead>
      <tbody>
        { Range(0, 6).map((x) => (
            <tr key={props.year + '-' + props.month + '-' + x}>
              { props.daysOfWeek
                     .map((y) => (
                       <CalendarDate
                         key={props.year + '-' + props.month + '-' + x + y}
                         year={props.year}
                         month={props.month}
                         day={getDay(y, x)}
                         editMode={props.editMode}
                         events={props.events}
                         onSubmit={props.onSubmit}
                       />
                     ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
};

export default Calendar;
