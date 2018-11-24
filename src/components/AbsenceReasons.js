import React from 'react';

import { reasonToEventClassName } from '../selectors';

class AbsenceReasons extends React.PureComponent {

  render() {
    return (
      <div className='absence-reasons'>
        {this.props.absenceReasons.map((x) => (
          <div
            key={x.id}
            className={`event-${reasonToEventClassName(x.id)}`}
            onClick={() => this.props.saveAbsence(x.id)}
          >
            {x.name}
          </div>
        ))}
      </div>
    );
  }
}

export default AbsenceReasons;
