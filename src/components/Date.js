import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import classNames from 'classnames';
import AbsenceReasons from './AbsenceReasons';
import { getDate, isToday, isFuture, isWeekend } from 'date-fns';

import {
  setActiveAbsenceReason, removeActiveAbsenceReason
} from '../actions';

class Date extends React.PureComponent {

  constructor(props) {
    super(props)
    const future = this.props.date ? isFuture(this.props.date) || isToday(this.props.date) : false;
    this.state = {
      future: future,
      editable: future,
      absenceReason: '',
    }
  }

  componentDidMount() {
    if (this.props.date && this.props.events) {
      this.setStates();
    }
  }

  componentDidUpdate(prev) {
    if (this.props.events && prev.events !== this.props.events) {
      this.setStates();
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

    const hours = this.props.events && this.props.events
      .filter(x => x.minutes > 0 && x.minutes < 450)
      .map(x => x.minutes / 60)
      .join();

    return (
      <div
        className={dateClassNames}
        onMouseOver={this.hover}
        onMouseOut={this.stopHover}
      >
        {this.state.future ? null : <div className='date-past' />}
        <div
          className='date-inner'
          onClick={this.handleClick}
        >
          {this.props.clicked ?
            <div className={'date-number'}>
              {this.props.dateString}
            </div> : <div className={'date-number'}>
              {getDate(this.props.date)}
            </div>}
          <p className={'date-text'}>
            {hours ? hours + ' t' : null}
          </p>
        </div>
        {this.props.showAbsenceReasonContainer ?
          <AbsenceReasons
            saveAbsence={this.props.saveAbsence}
            absenceReasons={this.props.absenceReasons}
            removeAbsence={this.props.removeAbsence}
            cancel={this.props.cancel}
            dateString={this.props.dateRangeString}
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
    if (this.state.absenceReason) {
      this.props.setActiveAbsenceReason(this.state.absenceReason);
    }
    this.props.hoverDate(this.props.date);
  }

  stopHover = () => {
    if (this.state.absenceReason) {
      this.props.removeActiveAbsenceReason();
    }
    this.props.stopHoverDate();
  }

  setStates = () => {
    if (this.props.events.some((x) => x.eventId)) {
      this.setState({ absenceReason: this.props.events.map(x => x.eventId).join() });
    }
    else {
      this.setState({ absenceReason: '' });
      this.props.removeActiveAbsenceReason();
    }
    if (this.props.events.some((x) => x.eventClassName === 'holiday')) {
      this.setState({ editable: false });
    }
  }
}


const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setActiveAbsenceReason,
  removeActiveAbsenceReason,
};

export default connect(mapStateToProps, mapDispatchToProps)(Date);