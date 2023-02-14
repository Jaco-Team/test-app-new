import React from 'react';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default class MyCheckBox extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  render(){
    return (
      <FormGroup row style={ this.props.style ? this.props.style : {} }>
        <FormControlLabel
          control={
            <Checkbox
              disabled={ this.props.disabled || this.props.disabled === true ? true : false }
              checked={this.props.value}
              onChange={this.props.func}
              color="primary"
            />
          }
          label={this.props.label}
        />
      </FormGroup>
    )
  }
}