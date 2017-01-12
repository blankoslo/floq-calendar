import React from 'react';
import { Map, Range } from 'immutable';
import moment from 'moment';
import classNames from 'classnames';

const isWeekend = (day) => day === 6 || day === 7;

export const getDayText = (startOfMonth, x, y) => {
  const startOfMonthDay = startOfMonth.isoWeekday() - 1;
  const daysInMonth = startOfMonth.daysInMonth();
  const day = x + y * 7 - startOfMonthDay + 1;
  return (day > 0 && day <= daysInMonth) ? day.toString() : '';
};

class CalendarDate extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.year !== nextProps.year ||
           this.props.month !== nextProps.month ||
           this.props.day !== nextProps.day ||
           this.props.events !== nextProps.events ||
           this.props.editMode !== nextProps.editMode
  }

  render() {
    const props = this.props;
    const dateText = props.year + '-' +
                     props.month + '-' +
                     props.day;
    const day = props.day && moment(dateText, 'YYYY-M-D');
    const weekend = props.day && isWeekend(day.isoWeekday());
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
          title={props.events && props.events.map((x) => x.event).join()}
        >
          {props.day}
        </div>
        <div className={dayClassNames}>
          {props.events && props.events.map((x) => x.event).join()}
        </div>
      </td>
    );
  }
}

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
                     })
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
};

export default Calendar;
