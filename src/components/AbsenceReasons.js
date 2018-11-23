import React from 'react';
import { connect } from 'react-redux';

import { reasonToEventClassName } from '../selectors';

class AbsenceReasons extends React.PureComponent {

  render() {
    return (
      <div className='absence-reasons'>
        {this.props.absenceReasons.map((x) => (
          <div
            key={x.id}
            className={`event-${reasonToEventClassName(x.id)}`}
            onClick={() => this.handleClick(x.id)}
          >
            {x.name}
          </div>
        ))}
      </div>
    );
  }

  handleClick = (id) => {
    this.props.saveAbsence(id);
  }
}

const mapStateToProps = (state) => ({
  absenceReasons: state.absenceReasons,
});

export default connect(mapStateToProps, {})(AbsenceReasons);
