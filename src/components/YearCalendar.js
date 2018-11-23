import React from 'react';
import { Range } from 'immutable';
import dateFns from 'date-fns';
import nbLocale from 'date-fns/locale/nb';

import Calendar from './Calendar';

const emojiMap = {
  1: '',
  2: '',
  3: '',
  4: '🐣',
  5: '',
  6: '',
  7: '☀️',
  8: '',
  9: '',
  10: '',
  11: '',
  12: '🎄',
}

const getMonthText = (year, month) => {
  const date = new Date(year, month - 1, 1);
  return dateFns.format(date, 'MMMM', { locale: nbLocale }) + ' ' + emojiMap[month];
};

class YearCalendar extends React.Component {
  render() {
    return (
      <div className='year-calendar'>
        {Range(1, 13).map((x) => (
          <div
            key={`${this.props.year}-${x}`}
            className='month'
          >
            <h5 className='month-header'>
              {`${getMonthText(this.props.year, x)}`}
            </h5>
            <Calendar
              key={x}
              year={this.props.year}
              month={x}
              events={this.props.events}
              absenceReasons={this.props.absenceReasons}
              addDate={this.props.addDate}
              updateCalendar={this.props.updateCalendar}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default YearCalendar;
