import React from 'react';
import IconButton from 'material-ui/IconButton';

class YearSelector extends React.PureComponent {

  render() {
    return (
      <div className='year-selector'>
        <IconButton
          iconClassName='material-icons'
          onClick={this.props.selectPreviousYear}
          iconStyle={{ fontSize: 18, color: '#6600ff' }}>
          arrow_back
        </IconButton>
        <h1 className={'year-selector-text'}>
          {this.props.year.toString()}
        </h1>
        <IconButton
          iconClassName='material-icons'
          onClick={this.props.selectNextYear}
          iconStyle={{ fontSize: 18, color: '#6600ff' }}>
          arrow_forward
        </IconButton>
      </div>
    );
  }
};

export default YearSelector;
