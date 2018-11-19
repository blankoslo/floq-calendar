import React from 'react';
import { List, Range } from 'immutable';
import dateFns from 'date-fns';
import nbLocale from 'date-fns/locale/nb';

import Calendar from './Calendar';
import AbsenceInfo from './AbsenceInfo';

const daysOfWeek = List(['ma', 'ti', 'on', 'to', 'fr']);

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

class YearCalendar extends React.PureComponent {
  componentDidMount() {
    setTimeout(() => {
      const dateId = this.props.year + '-' + this.props.selectedMonth;
      const e = document.getElementById(dateId);
      if (e) {
        e.scrollIntoView(true);
      }
    }, 0);
  }

  render() {
    return (
      <div className='year-wrapper'>
        <AbsenceInfo
          year={this.props.year}
          onPrevYear={this.props.onPrevYear}
          onNextYear={this.propsonNextYear}
        />
        <div className='year-calendar'>
          {Range(1, 13).map((x) => (
            <div
              key={`${this.props.year}-${x}`}
              id={`${this.props.year}-${x}`}
              className='month'
            >
              <div className='month-header'>
                {`${getMonthText(this.props.year, x)}`}
              </div>
              <Calendar
                key={x}
                year={this.props.year}
                month={x}
                events={this.props.events}
                editMode={this.props.editMode}
                onSubmit={this.props.onSubmit}
                daysOfWeek={daysOfWeek}
              />
            </div>
          ))
          }
        </div>
      </div>
    );
  }
}

export default YearCalendar;
