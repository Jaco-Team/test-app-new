import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';

import { AuthSwitchPC, BasketSwitchPC, IOSSwitch } from './MySwitch_styled';

type MySwitchProps = {
  type?: 'auth' | 'cart' | 'ios' | string;
  checked?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export class MySwitch extends React.PureComponent<MySwitchProps> {

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
          label=""
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
