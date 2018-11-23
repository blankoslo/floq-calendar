import React from 'react';
import IconButton from 'material-ui/IconButton';

class AbsenceInfo extends React.PureComponent {
  render() {
    return (
      <div className='info'>
        <div className='employee-container'>
          {this.props.currentEmployee ? this.props.currentEmployee.name : ''}
        </div>
        <div className='info-box-container'>
        <div className='info-box year-selector'>
          <h1 className={'year-selector-text'}>
            {this.props.year.toString()}
          </h1>
          <div className='arrows'>
            <IconButton
              iconClassName='material-icons'
              onClick={this.props.prevYear}
              iconStyle={{ fontSize: 16, color: '#6600ff' }}
            >
              arrow_back
          </IconButton>
            <IconButton
              iconClassName='material-icons'
              onClick={this.props.nextYear}
              iconStyle={{ fontSize: 16, color: '#6600ff' }}
            >
              arrow_forward
          </IconButton>
          </div>
        </div>
        {/* 
        <div className='info-box'>
          <div className='info-header'>
            Tidligere Fravær
          </div>
          <div>Lorem ipsum</div>
          <div>Lorem ipsum</div>
          <div>Lorem ipsum</div>
          <div>Lorem ipsum</div>
        </div>
        <div className='info-box'>
          <div className='info-header'>
            Kommende Fravær
          </div>
          <div>Lorem ipsum</div>
          <div>Lorem ipsum</div>
          <div>Lorem ipsum</div>
        </div>
        */}
        </div>
      </div>
    );
  }
};

export default AbsenceInfo;
