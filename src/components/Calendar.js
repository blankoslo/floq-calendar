import React from 'react';
import { Map, Range } from 'immutable';
import classNames from 'classnames';
import getISODay from 'date-fns/get_iso_day';
import getDaysInMonth from 'date-fns/get_days_in_month';
import isWeekend from 'date-fns/is_weekend';

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

    if (weekend) {
      return null;
    }

    const holiday = props.events &&
      props.events.some((x) => x.eventClassName === 'holiday');
    const eventClassNames = props.events && Map(props.events
      .map((x) => [`event-${x.eventClassName}`, true]))
      .toObject();
    const editable = props.day
      && !holiday
      && props.editMode;
    const dayClassNames = classNames({
      ...eventClassNames,
      'month-calendar-event': true
    });
    const dateClassNames = classNames({
      ...eventClassNames,
      date: true,
      'date-disabled': !props.day,
      'date-edit-mode': editable
    });
    return (
      <div
        className={dateClassNames}
        onClick={() => editable && props.onSubmit(day)}
      >
        <div className={'date-text'}>
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
  return (
    <div className={'calendar'}>
      <div className='calendar-header'>
        {props.daysOfWeek.map((x) =>
          <div className='calendar-header-day' key={x}>{x}</div>
        )}
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
