import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';

import { AuthSwitchPC, BasketSwitchPC, IOSSwitch } from './MySwitch_styled';

export class MySwitch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    if (this.props.type === 'auth') {
      return (
        <AuthSwitchPC
          onClick={this.props.onClick}
          checked={this.props.checked}
        />
      );
    }

    if (this.props.type === 'cart') {
      return (
        <BasketSwitchPC
          onClick={this.props.onClick}
          checked={this.props.checked}
        />
      );
    }

    if (this.props.type === 'ios') {
      return (
        <FormControlLabel
          style={{ zIndex: 3 }}
          control={
            <IOSSwitch
              checked={this.props.checked}
              onClick={this.props.onClick}
            />
          }
        />
      );
    }
  }
}

MySwitch.propTypes = {
  type: PropTypes.string.isRequired,
};
