import React from 'react';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import isFriday from 'date-fns/is_friday';

import { reasonToEventName, dateRangeToDateString } from '../selectors';

class AbsenceInfo extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      dates: [],
    }
  }

  componentDidMount() {
    if (this.props.absence && this.props.absence.size > 0) {
      this.getAbsenceStrings();
    }
  }

  componentDidUpdate(prev) {
    if (this.props.absence !== prev.absence && this.props.absence.size > 0) {
      this.getAbsenceStrings();
    }
  }


  render() {
    return (
      <div className='info'>
        <div className='info-box'>
          <h6 className='info-header'> Planlagt Fravær </h6>
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

  getAbsenceStrings = () => {
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
