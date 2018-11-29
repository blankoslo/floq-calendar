import React from 'react';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import format from 'date-fns/format';
import isFriday from 'date-fns/is_friday';
import nbLocale from 'date-fns/locale/nb';
import getYear from 'date-fns/get_year';

import { reasonToEventName, dateRangeToDateString } from '../selectors';

class AbsenceInfo extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      past: [],
      future: []
    }
  }

  componentDidMount() {
    if (this.props.absence && this.props.absence.size > 0) {
      this.getAbsenceStrings();
    }
  }

  componentDidUpdate(prev) {
    if ((this.props.absence !== prev.absence || this.props.year !== prev.year) && this.props.absence.size > 0) {
      this.getAbsenceStrings();
    }
  }


  render() {
    return (
      <div className='info'>
        <div className='info-box-container'>
          <div className='info-box'>
            <h6 className='info-header'> Tidligere Fravær </h6>
            <ul className='info-list'>
              {this.state.past.map(el => {
                const key = Object.keys(el)[0];
                const dates = this.dateRangeToDateString(el[key]);
                return (
                  <li key={dates}>
                    <span>{reasonToEventName(key)}</span> {dates}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='info-box'>
            <h6 className='info-header'> Kommende Fravær </h6>
            <ul className='info-list'>
              {this.state.future.map(el => {
                const key = Object.keys(el)[0];
                const dates = this.dateRangeToDateString(el[key]);
                return (
                  <li key={dates}>
                    <span>{reasonToEventName(key)}</span> {dates}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  getAbsenceStrings = () => {
    const pastAndFutureDates = this.getPastAndFutureDates(this.props.absence.valueSeq().flatten());
    const past = this.group(pastAndFutureDates[0]);
    const future = this.group(pastAndFutureDates[1]);

    this.setState({ past: past, future: future });
  }

  getPastAndFutureDates = (arr) => {
    const today = new Date();

    let future = {};
    let past = {};

    arr.forEach(element => {
      if (getYear(element.date) !== this.props.year) {
        return;
      }
      const diff = differenceInCalendarDays(today, element.date);
      if (diff > 0) {
        past = { ...past, [diff]: element }
      }
      else {
        future = { ...future, [diff]: element }
      }
    });
    return [past, future];
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
