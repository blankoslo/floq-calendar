import React from 'react';

import { reasonToEventName, dateRangeToDateString } from '../selectors';

class FutureAbsence extends React.PureComponent {

  render() {
    return (
      <div className='absence-box'>
        <h5> KOMMENDE FRAVÆR </h5>
        <ul className='info-list'>
          {this.props.dates.map(el => {
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
    );
  }
};

export default FutureAbsence;
