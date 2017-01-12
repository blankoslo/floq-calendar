import React from 'react';
import { List }  from 'immutable';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';

import Calendar from './Calendar';

const daysOfWeek = List([
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lørdag',
  'Søndag'
]);

class MonthCalendar extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      const dateId = this.props.year + '-' + this.props.month;
      const e = document.getElementById(dateId);
      if (e) {
        e.scrollIntoView(true);
      }
    }, 0);
  }

  render() {
    return (
      <div
        id={`${this.props.year}-${this.props.month}`}
        className='month-calendar'
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <IconButton
            iconClassName='material-icons'
            style={{ display: 'inline-block' }}
            onClick={() => this.props.onPrevMonth()}
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
              {`${moment.months()[this.props.month - 1]}`}
            </span>
            <br/>
            <span style={{ fontSize: '1rem' }}>
              {this.props.year}
            </span>
          </div>
          <IconButton
            iconClassName='material-icons'
            style={{ display: 'inline-block' }}
            onClick={() => this.props.onNextMonth()}
          >
            arrow_forward
          </IconButton>
        </div>
        <Calendar
          className='month-calendar'
          year={this.props.year}
          month={this.props.month}
          events={this.props.events}
          editMode={this.props.editMode}
          onSubmit={this.props.onSubmit}
          daysOfWeek={daysOfWeek}
        />
      </div>
    );
  }
};

export default MonthCalendar;
