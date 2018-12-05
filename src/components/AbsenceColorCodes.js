import React from 'react';

class AbsenceColorCodes extends React.PureComponent {

  render() {

    if (this.props.activeAbsenceReason) {
      return (
        <div className='absence-codes'>
          <h5> FARGEKODER </h5>
          <div>
            {this.props.absenceReasonGroups.entrySeq().map(([key, value]) => {
              let active = false;
              if (value.keySeq().toArray().some(k => k === this.props.activeAbsenceReason)) {
                active = true;
              }
              return (
                <div key={key} className='absence-code'>
                  <div className={`event-${key} absence-code-color ${active ? '' : 'absence-code-inactive'}`} />
                  {value.entrySeq().map(reason => {
                    return (
                      <p key={reason[0]}
                        className={reason[0] === this.props.activeAbsenceReason ?
                          null : 'absence-code-inactive'}>
                        {reason[1]}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className='absence-codes'>
        <h5> FARGEKODER </h5>
        <div>
          {this.props.absenceReasonGroups.entrySeq().map(([key, value]) => {
            return (
              <div key={key} className='absence-code'>
                <div className={`event-${key} absence-code-color`} />
                {value.entrySeq().map(reason => {
                  return <p key={reason[0]}>{reason[1]}</p>
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default AbsenceColorCodes;
