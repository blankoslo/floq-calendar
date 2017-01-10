import React from 'react';
import { Range } from 'immutable';
import IconButton from 'material-ui/IconButton';

import Calendar from './Calendar';

export default (props) => {
  const months = Range(1, 13).map((x) => (
    <Calendar
      key={x}
      year={props.year}
      month={x}
      events={props.events}
      editMode={props.editMode}
      onSubmit={props.onSubmit}
    />
  ));
  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>
        <IconButton
          iconClassName='material-icons'
          onClick={props.onPrevYear}
        >
          arrow_back
        </IconButton>
        {props.year.toString()}
        <IconButton
          iconClassName='material-icons'
          onClick={props.onNextYear}
        >
          arrow_forward
        </IconButton>
      </h3>
      <div style={{ textAlign: 'center' }}>
        {months}
      </div>
    </div>
  );
}
