import React from 'react';
import IconButton from 'material-ui/IconButton';

class AbsenceInfo extends React.PureComponent {
  render() {
    return (
      <div className='info'>
        <div className='info-box year-selector'>
          <div className={'year-selector-text'}>
            {this.props.year.toString()}
          </div>
          <div className='arrows'>
            <IconButton
              iconClassName='material-icons'
              onClick={this.props.onPrevYear}
              iconStyle={{ fontSize: 16, color: '#6600ff' }}
            >
              arrow_back
          </IconButton>
            <IconButton
              iconClassName='material-icons'
              onClick={this.props.onNextYear}
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
    );
  }
};

export default AbsenceInfo;
