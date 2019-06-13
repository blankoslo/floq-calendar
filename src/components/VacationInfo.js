import React from 'react';

class VacationInfo extends React.PureComponent {

  render() {
    return (
      <div className='vacation-box'>
        <h5> FERIE </h5>
        <div className='vacation-box-purple vacation-box-dotted'>
          <p>Totalt tilgjengelig</p>
          <p className='vacation-box-number'>{(Math.round((this.props.holidayDays.totAvailable) * 100) / 100).toLocaleString('nb-NO')}</p>
        </div>
        <div className='vacation-box-pink vacation-box-dotted'>
          <p>Brukt</p>
          <p className='vacation-box-number'>{this.props.holidayDays.used !== 0 ?
            '-' + (Math.round((this.props.holidayDays.used) * 100) / 100).toLocaleString('nb-NO')
            : 0}</p>
        </div>
        <div className='vacation-box-pink vacation-box-line'>
          <p>Planlagt</p>
          <p className='vacation-box-number'>{this.props.holidayDays.planned !== 0 ? '−' + this.props.holidayDays.planned : 0}</p>
        </div>
        <div className='vacation-box-purple vacation-box-double'>
          <p>SUM igjen</p>
          <p className='vacation-box-number'>{(Math.round((this.props.holidayDays.available) * 100) / 100).toLocaleString('nb-NO')}</p>
        </div>
      </div>
    );
  }
};

export default VacationInfo;
