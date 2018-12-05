import React from 'react';

import { reasonToEventGroup, reasonToEventName } from '../selectors';

class AbsenceReasons extends React.PureComponent {

  render() {
    return (
      <ul className='absence-reasons'>
        <div className='cross' onClick={this.props.cancel}> X </div>
        <li className='absence-reasons-summary'>
          <h5>{this.props.dateString}</h5>
          <p>Velg type fravær</p>
        </li>
        {this.props.absenceReasons.map((x) => (
          <li
            key={x.id}
            className={`event-${reasonToEventGroup(x.id)}`}
            onClick={() => this.props.saveAbsence(x.id)}
          >
            {reasonToEventName(x.id)}
          </li>
        ))}
        <li
          className='absence-reasons-nothing'
          onClick={this.props.removeAbsence}
        >
          Fjærn fravær
        </li>
      </ul>
    );
  }
}

export default AbsenceReasons;
