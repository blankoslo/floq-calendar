import React from 'react';
import { Map } from 'immutable';
import classNames from 'classnames';
import AbsenceReasons from './AbsenceReasons';

class CalendarDate extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      editable: this.props.day ? true : false,
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
      .filter(x => x.event)
      .map((x) => [`event-${x.eventClassName}`, true]))
      .toObject();

    const dateClassNames = classNames({
      ...eventClassNames,
      date: true,
      'date-disabled': !this.props.day,
      'date-editable': this.state.editable,
      'date-clicked': this.props.clicked
    });
    return (
      <div className={dateClassNames}>
        {this.props.showAbsenceReasonContainer ?
          <div className='cross' onClick={this.props.cancel}> X </div>
          : null}
        <div
          className='date-inner'
          onMouseDown={this.start}
          onMouseOver={this.over}
          onMouseUp={this.stop}
        >
          <div className={'date-number'}>
            {this.props.day}
          </div>
          <div className={'date-text'}>
            {this.props.events && this.props.events.map((x) => x.event).join()}
          </div>
        </div>
        {this.props.showAbsenceReasonContainer ?
          <AbsenceReasons
            saveAbsence={this.props.saveAbsence}
            absenceReasons={this.props.absenceReasons}
          /> : null}
      </div>
    );
  }

  start = () => {
    if (this.state.editable && !this.props.isMouseDown) {
      this.props.startSelect();
      this.props.addDate(this.props.date, this.props.day);
    }
  }

  over = () => {
    if (this.state.editable && this.props.isMouseDown) {
      this.props.addDate(this.props.date, this.props.day);
    }
  }

  stop = () => {
    if (this.state.editable && this.props.isMouseDown) {
      this.props.stopSelect(this.props.day);
    }
  }

  checkIfHoliday = () => {
    if (this.props.events.some((x) => x.eventClassName === 'holiday')) {
      this.setState({ editable: false });
    }
  }
}

export default CalendarDate;
