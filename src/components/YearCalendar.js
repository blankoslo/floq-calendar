import React from 'react';
import { List, Range } from 'immutable';
import IconButton from 'material-ui/IconButton';
import dateFns from 'date-fns';
import nbLocale from 'date-fns/locale/nb';

import Calendar from './Calendar';

const daysOfWeek = List(['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø']);

const getMonthText = (year, month) => {
  const date = new Date(year, month - 1, 1);
  return dateFns.format(date, 'MMMM', { locale: nbLocale });
}

class YearCalendar extends React.Component {
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
    const setYearMonth = this.props.onSetCurrentYearMonth;
    return (
      <div>
        <h3 style={{ textAlign: 'center' }}>
          <IconButton
            iconClassName='material-icons'
            onClick={this.props.onPrevYear}
          >
            arrow_back
          </IconButton>
          {this.props.year.toString()}
          <IconButton
            iconClassName='material-icons'
            onClick={this.props.onNextYear}
          >
            arrow_forward
          </IconButton>
        </h3>
        <div style={{ textAlign: 'center' }}>
          { Range(1, 13).map((x) => (
              <div
                key={`${this.props.year} - ${x}`}
                style={{ display: 'inline-block' }}
              >
                <h5
                  className='month-header'
                  onClick={() => setYearMonth(this.props.year, x)}
                >
                  {`${getMonthText(this.props.year, x)} ${this.props.year}`}
                </h5>
                <Calendar
                  key={x}
                  className='calendar'
                  year={this.props.year}
                  month={x}
                  events={this.props.events}
                  editMode={this.props.editMode}
                  onSubmit={this.props.onSubmit}
                  onSetCurrentYearMonth={this.props.onSetCurrentYearMonth}
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
