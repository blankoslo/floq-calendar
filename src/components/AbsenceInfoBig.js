import React from 'react';

import AbsenceColorCodes from './AbsenceColorCodes';
import YearSelector from './YearSelector';
import VacationInfo from './VacationInfo';
import FutureAbsence from './FutureAbsence';

export default class AbsenceInfoBig extends React.Component {

  render() {

    return (
      <div className='info info-big'>
        <div className='info-inner-big'>
          <h6 className='employee-container'>
            {this.props.currentEmployee ? this.props.currentEmployee.name.toUpperCase() : ''}
          </h6>
          <YearSelector
            year={this.props.year}
            selectPreviousYear={this.props.selectPreviousYear}
            selectNextYear={this.props.selectNextYear}
          />
          <div className='info-box'>
            <VacationInfo
              holidayDays={this.props.holidayDays}
            />
          </div>
          <div className='info-box'>
            <AbsenceColorCodes
              absenceReasonGroups={this.props.absenceReasonGroups}
              activeAbsenceReason={this.props.activeAbsenceReason}
            />
          </div>
          <div className='info-box'>
            <FutureAbsence
              dates={this.props.dates}
            />
          </div>
        </div>
      </div>
    );
  }

};
