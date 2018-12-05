import React from 'react';

import { reasonToEventClassName } from '../selectors';

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
            className={`event-${reasonToEventClassName(x.id)}`}
            onClick={() => this.props.saveAbsence(x.id)}
          >
            {x.name}
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
