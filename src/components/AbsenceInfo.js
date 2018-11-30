import React from 'react';
import { List } from 'immutable';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import isFuture from 'date-fns/is_future';
import isFriday from 'date-fns/is_friday';
import IconButton from 'material-ui/IconButton';

import { reasonToEventName, dateRangeToDateString } from '../selectors';

class AbsenceInfo extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      dates: [],
      holidayDays: {
        available: 0,
        planned: 0,
      }
    }
  }

  componentDidMount() {
    if (this.props.absence && this.props.holidayDays) {
      this.getAbsenceStrings();
      this.calculateHolidayDays();
    }
  }

  componentDidUpdate(prev) {
    if (this.props.absence !== prev.absence) {
      this.getAbsenceStrings();
      this.calculateHolidayDays();
    }
    if (this.props.holidayDays !== prev.holidayDays) {
      this.calculateHolidayDays();
    }
  }


  render() {
    return (
      <div className='info'>
        <h5 className='employee-container'>
          {this.props.currentEmployee ? this.props.currentEmployee.name.toUpperCase() : ''}
        </h5>
        <div className='year-selector'>
          <IconButton
            iconClassName='material-icons'
            onClick={this.props.selectPreviousYear}
            iconStyle={{ fontSize: 18, color: '#6600ff' }}>
            arrow_back
            </IconButton>
          <h1 className={'year-selector-text'}>
            {this.props.year.toString()}
          </h1>
          <IconButton
            iconClassName='material-icons'
            onClick={this.props.selectNextYear}
            iconStyle={{ fontSize: 18, color: '#6600ff' }}>
            arrow_forward
          </IconButton>
        </div>
        <div className='info-box'>
          <h5> FERIE </h5>
          <p><strong>{this.state.holidayDays.planned}</strong> planlagte feriedager</p>
          <p>av <strong>{this.state.holidayDays.available} dager</strong> tilgjengelig</p>
        </div>
        <div className='info-box'>
          <h5> KOMMENDE FRAVÆR </h5>
          <ul className='info-list'>
            {this.state.dates.map(el => {
              const key = Object.keys(el)[0];
              const dates = dateRangeToDateString(el[key]);
              return (
                <li key={dates}>
                  <span>{reasonToEventName(key)}</span> {dates}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  calculateHolidayDays = () => {
    const availableDays = this.calcTotalAvailable();

    const plannedDays = List(this.props.absence.valueSeq().flatten()
      .filter(x => isFuture(x.date) && x.reason === 'FER1000')).size;

    this.setState({
      holidayDays: {
        planned: plannedDays,
        available: availableDays
      }
    });
  }

  calcTotalAvailable = () => {
    const tot = this.props.holidayDays
      .reduce((acc, curr) => acc + curr.availableDays, 0);

    return (Math.round(tot * 100) / 100).toLocaleString('nb-NO')
  }

  getAbsenceStrings = () => {
    if (this.props.absence.size < 1) return;
    const dates = this.group(this.getFutureDates(this.props.absence.valueSeq().flatten()));
    this.setState({ dates: dates });
  }

  getFutureDates = (arr) => {
    const today = new Date();

    return arr.reduce((acc, curr) => {
      const diff = differenceInCalendarDays(today, curr.date);
      if (diff <= 0) {
        return { ...acc, [diff]: curr };
      }
      return acc;
    }, {});
  }

  group = (obj) => {
    const result = [];
    let curr = [];
    let expectedNumber = NaN;
    let expectedType = '';

    const keys = Object.keys(obj).map(key => Number(key)).sort((a, b) => b - a);

    keys.forEach(key => {
      const el = obj[key];
      if (!expectedNumber || (key === expectedNumber && el.reason === expectedType)) {
        curr.push(el.date);
      }
      else {
        result.push({ [expectedType]: curr });
        curr = [el.date];
      }
      expectedNumber = isFriday(el.date) ? key - 3 : key - 1;
      expectedType = el.reason;
    });
    if (curr.length > 0) {
      result.push({ [expectedType]: curr });
    }
    return result;
  }
};

export default AbsenceInfo;
