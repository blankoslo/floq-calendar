import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class Header extends React.PureComponent {
  render() {
    return (
      <div className='header'>
        <div className='employee'>
          {this.props.currentEmployee ? this.props.currentEmployee.name : ''}
        </div>
        <div className='absence'>
          {this.props.absenceReasons.map(reason => {
            return (
              <div className='absence-bar' key={reason.id}>
                <div className={'absence-color ' + reason.id}/>
                <div>
                  {reason.name}
                </div>
              </div>
            );
          })}
        </div>
        <div className='edit-button'>
          <RaisedButton
            label={this.props.absenceReasonToolLabel}
            primary={this.props.absenceReasonTool.active}
            onClick={this.props.handleSetAbsenceReasonTool}
          />
        </div>
      </div>
    );
  }
};

export default Header;
