import React from 'react';
import { Map, List, Range } from 'immutable';
import moment from 'moment';
import classNames from 'classnames';
import IconButton from 'material-ui/IconButton';

const daysOfWeek = List([
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lørdag',
  'Søndag'
]);

const isWeekend = (day) => day === 'Lørdag' || day === 'Søndag';

const getDayText = (startOfMonth, daysInMonth, x, y) => {
  const day = x + y * 7 - startOfMonth + 1;
  return (day > 0 && day <= daysInMonth) ? day.toString() : '';
};

class MonthCalendar extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      const dateId = moment().format('YYYY-M');
      const e = document.getElementById(dateId);
      if (e) {
        e.scrollIntoView(true);
      }
    }, 100);
  }

  render() {
    const props = this.props;
    const events = props.events || List();
    const startOfMonth = moment(props.year + '-' + props.month, 'YYYY-M');
    const dayOfWeek = startOfMonth.isoWeekday() - 1;
    const daysInMonth = startOfMonth.daysInMonth();
    const days = <tr>{daysOfWeek.map((x) => <th key={x}>{x}</th>)}</tr>;
    const dates = Range(0, 6).map((x) =>
      <tr key={x}>
        { daysOfWeek.map((y) => {
            const dayText =
              getDayText(dayOfWeek, daysInMonth, daysOfWeek.indexOf(y), x);
            const day = dayText && moment(props.year + '-' +
                                          props.month + '-' +
                                          dayText, 'YYYY-M-D');
            const dayEvents = events.filter((x) => x.date.isSame(day));
            const holiday = dayEvents.some((x) => x.eventClassName === 'holiday');
            const dayEventClassNames = Map(dayEvents
              .map((x) => [`event-${x.eventClassName}`, true]))
              .toObject();
            const editable = dayText
                          && !isWeekend(y)
                          && !holiday
                          && props.editMode;
            const dayClassNames = classNames({
              ...dayEventClassNames,
              'month-calendar-event': true,
              'disabled': !dayText,
              'weekend': isWeekend(y),
              'edit-mode': editable
            });
            return (
              <td
                key={y}
                className={dayClassNames}
                onClick={() => editable && props.onSubmit(day)}
              >
                <div
                  className='month-calendar-day'
                  title={dayEvents.map((x) => x.event).join()}
                >
                  {dayText}
                </div>
                <div className={dayClassNames}>
                  {dayEvents.map((x) => x.event).join()}
                </div>
              </td>
            );
          })
        }
      </tr>
    );
    return (
      <div
        id={`${props.year}-${props.month}`}
        className='month-calendar'
      >
        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <IconButton
            iconClassName='material-icons'
            style={{ display: 'inline-block' }}
            onClick={() => props.onPrevMonth()}
          >
            arrow_back
          </IconButton>
          <div
            style={{ display: 'inline-block' }}
          >
            <span
              style={{
                fontSize: '2rem',
                textTransform: 'capitalize'
              }}
            >
              {`${moment.months()[startOfMonth.month()]}`}
            </span>
            <br/>
            <span style={{ fontSize: '1rem' }}>
              {props.year}
            </span>
          </div>
          <IconButton
            iconClassName='material-icons'
            style={{ display: 'inline-block' }}
            onClick={() => props.onNextMonth()}
          >
            arrow_forward
          </IconButton>
        </div>
        <table
          className={classNames({
              'month-calendar': true,
              'edit-mode': props.editMode
            })}
        >
          <thead>{days}</thead>
          <tbody>{dates}</tbody>
        </table>
      </div>
    );
  }
};

export default MonthCalendar;
