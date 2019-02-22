import React from 'react';

import AbsenceColorCodes from './AbsenceColorCodes';
import YearSelector from './YearSelector';
import VacationInfo from './VacationInfo';

export default class AbsenceInfoSmall extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      displayVacation: false,
      displayColorCodes: false
    }
  }

  render() {

    let innerDropdown = this.state.displayVacation ?
      <VacationInfo holidayDays={this.props.holidayDays} /> : null;
    if (this.state.displayColorCodes) {
      innerDropdown =
        <AbsenceColorCodes
          absenceReasonGroups={this.props.absenceReasonGroups}
          activeAbsenceReason={this.props.activeAbsenceReason}
        />
    }

    return (
      <div className='info info-small'>
        <div className='info-inner-small'>
          <YearSelector
            year={this.props.year}
            selectPreviousYear={this.props.selectPreviousYear}
            selectNextYear={this.props.selectNextYear}
          />
          <button onClick={this.openVacationDropdown}> Ferie 🏝  </button>
          <button onClick={this.openColorCodeDropdown}> Fargekoder? </button>
        </div>
        {this.state.displayColorCodes || this.state.displayVacation ?
          <div>
            <div className='info-small-dropdown'>
              {innerDropdown}
            </div>
            <div className='close-small-dropdown' onClick={this.closeDropdown}> lukk </div>
          </div>
          : null}
      </div>
    );
  }

  openVacationDropdown = () => {
    this.setState({ displayVacation: true, displayColorCodes: false });
  }

  openColorCodeDropdown = () => {
    this.setState({ displayVacation: false, displayColorCodes: true });
  }

  closeDropdown = () => {
    this.setState({ displayVacation: false, displayColorCodes: false });
  }
};