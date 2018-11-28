import React from 'react';
import getYear from 'date-fns/get_year';

import { reasonToEventClassName, reasonToEventName } from '../selectors';

class Header extends React.PureComponent {
  render() {

    let arr = [];
    if (this.props.absence) {
      arr = this.props.absence.valueSeq().flatten()
        .filter(x => getYear(x.date) === this.props.year)
        .map(x => x.reason).toJS();
    }

    return (
      <div className='header'>
        <div className='header-inner'>
          {this.props.absenceReasons.map(reason => {
            const days = arr.filter(x => x === reason.id).length;
            return (
              <div className='absence-bar' key={reason.id}>
                <div className={`absence-color event-${reasonToEventClassName(reason.id)}`} />
                <h5 className='absence-days'>{`${days} dager`}</h5>
                <h6 className='absence-days-reason'>{reasonToEventName(reason.id)}</h6>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default Header;
