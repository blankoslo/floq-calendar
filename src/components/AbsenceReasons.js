import React from 'react';

import { reasonToEventClassName } from '../selectors';

class AbsenceReasons extends React.PureComponent {

  render() {
    return (
      <ul className='absence-reasons'>
        {this.props.absenceReasons.map((x) => (
          <li
            key={x.id}
            className={`event-${reasonToEventClassName(x.id)}`}
            onClick={() => this.props.saveAbsence(x.id)}
          >
            {x.name}
          </li>
        ))}
      </ul>
    );
  }
}

export default AbsenceReasons;
