import React from 'react';
import { Map } from 'immutable';
import classNames from 'classnames';
import AbsenceReasons from './AbsenceReasons';

class CalendarDate extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showAbsenceReasonContainer: false,
      editable: this.props.day ? true : false,
      clicked: false,
    }
  }

  componentDidMount() {
    if (this.props.events) {
      this.checkIfHoliday();
    }
  }

  componentDidUpdate(prev) {
    if (this.props.events && prev.events !== this.props.events) {
      this.checkIfHoliday();
    }
  }

  render() {

    const eventClassNames = this.props.events && Map(this.props.events
      .map((x) => [`event-${x.eventClassName}`, true]))
      .toObject();

    const dateClassNames = classNames({
      ...eventClassNames,
      date: true,
      'date-disabled': !this.props.day,
      'date-editable': this.state.editable,
      'date-clicked': this.state.clicked
    });
    return (
      <div className={dateClassNames}>
        {this.state.showAbsenceReasonContainer ?
          <div className='cross' onClick={this.cancel}>
            X </div> : null}
        <div
          className='date-inner'
          onClick={this.handleClick}
        >
          <div className={'date-number'}>
            {this.props.day}
          </div>
          <div className={'date-text'}>
            {this.props.events && this.props.events.map((x) => x.event).join()}
          </div>
        </div>
        {this.state.showAbsenceReasonContainer ?
          <AbsenceReasons
            saveAbsence={this.saveAbsence}
          /> : null}
      </div>
    );
  }

  handleClick = () => {
    if (this.state.editable) {
      this.setState({ showAbsenceReasonContainer: true, clicked: true });
      this.props.addDate(new Date(this.props.year, this.props.month - 1, parseInt(this.props.day, 10)));
    }
  }

  cancel = () => {
    this.setState({ showAbsenceReasonContainer: false, clicked: false });
    this.props.addDate(new Date(this.props.year, this.props.month - 1, parseInt(this.props.day, 10)));
  }

  saveAbsence = (reason) => {
    if (this.state.editable) {
      this.props.updateCalendar(reason);
      this.setState({ showAbsenceReasonContainer: false, clicked: false });
    }
  }

  checkIfHoliday = () => {
    if (this.props.events.some((x) => x.eventClassName === 'holiday')) {
      this.setState({ editable: false });
    }
  }
}

export default CalendarDate;
