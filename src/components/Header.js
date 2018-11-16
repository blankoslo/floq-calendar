import React from 'react';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

class Header extends React.PureComponent {
  render() {
    return (
      <div className={'header'}>
        <div className='employee-picker'>
          <AutoComplete
            id='employee-selector-autocomplete'
            dataSource={this.props.employees}
            filter={AutoComplete.fuzzyFilter}
            searchText={(this.props.currentEmployee
              && this.props.currentEmployee.name) || ''}
            openOnFocus={true}
            onNewRequest={this.handleSetEmployee}
            textFieldStyle={{ color: '#3c1345', fontSize: '0.8rem', width: '11rem' }}
          />
        </div>
        <div className={'year-selector'}>
          <IconButton
            iconClassName='material-icons'
            onClick={this.props.onPrevYear}
            iconStyle={{fontSize: 18, color: '#6600ff'}}
          >
            arrow_back
          </IconButton>
          <div className={'year-selector-text'}>
            {this.props.year.toString()}
          </div>
          <IconButton
            iconClassName='material-icons'
            onClick={this.props.onNextYear}
            iconStyle={{fontSize: 18, color: '#6600ff'}}
          >
            arrow_forward
          </IconButton>
        </div>
        <div className='edit-button'>
          <RaisedButton
            label={this.props.absenceReasonToolLabel}
            primary={this.props.absenceReasonTool.active}
            onClick={this.handleSetAbsenceReasonTool}
          />
        </div>
      </div>
    );
  }
};

export default Header;
