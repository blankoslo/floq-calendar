import React from 'react';
import { Range } from 'immutable';

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
      {months}
    </div>
  );
}
