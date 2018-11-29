import React from 'react';
import { Map } from 'immutable';
import getDate from 'date-fns/get_date';
import isWeekend from 'date-fns/is_weekend';
import classNames from 'classnames';
import AbsenceReasons from './AbsenceReasons';

class Date extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      editable: true,
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

    if (!this.props.date) {
      return <div className='date date-disabled' />;
    }

    if (isWeekend(this.props.date)) {
      return null;
    }

    const eventClassNames = this.props.events && Map(this.props.events
      .filter(x => x.event)
      .map((x) => [`event-${x.eventClassName}`, true]))
      .toObject();

    const dateClassNames = classNames({
      ...eventClassNames,
      date: true,
      'date-editable': this.state.editable,
      'date-clicked': this.props.clicked,
    });

    return (
      <div className={dateClassNames}>
        {this.props.showAbsenceReasonContainer ?
          <div className='cross' onClick={this.props.cancel}> X </div>
          : null}
        <div
          className='date-inner'
          onClick={this.handleClick}
          onMouseOver={this.hover}
          onMouseOut={this.stopHover}
        >
          <div className={'date-number'}>
            {getDate(this.props.date)}
          </div>
          <div className={'date-text'}>
            {this.props.events && this.props.events.map((x) => x.event).join()}
          </div>
        </div>
        {this.props.showAbsenceReasonContainer ?
          <AbsenceReasons
            saveAbsence={this.props.saveAbsence}
            absenceReasons={this.props.absenceReasons}
            removeAbsence={this.props.removeAbsence}
          /> : null}
      </div>
    );
  }

  handleClick = () => {
    if (this.state.editable) {
      this.props.clickDate(this.props.date);
    }
  }

  hover = () => {
    this.props.hoverDate(this.props.date);
  }

  stopHover = () => {
    this.props.stopHoverDate();
  }

  checkIfHoliday = () => {
    if (this.props.events.some((x) => x.eventClassName === 'holiday')) {
      this.setState({ editable: false });
    }
  }
}

export default Date;
