import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default class MySelect extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  render(){
    return (
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel>{this.props.label}</InputLabel>
        <Select
          MenuProps={{
            className: this.props.className+'_menu'
          }}
          value={this.props.value}
          label={this.props.label}
          style={{ width: '100%', zIndex: 3 }} 
          variant={ this.props.variant ? this.props.variant : "outlined"  }
          disabled={ this.props.disabled || this.props.disabled === true ? true : false }
          onChange={ this.props.func }
          multiple={ this.props.multiple && this.props.multiple === true ? true : false }
        >
          { this.props.data.map( (item, key) =>
            <MenuItem key={key} value={item.id}>{item.name}</MenuItem>
          ) }
        </Select>
      </FormControl>
    )
  }
}