import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type SelectItem = {
  id: string | number;
  name: string;
};

type MySelectProps = {
  label?: string;
  className?: Record<string, unknown>;
  value?: unknown;
  variant?: 'outlined' | 'filled' | 'standard';
  disabled?: boolean;
  func?: (event: unknown) => void;
  multiple?: boolean;
  data?: SelectItem[];
};

export default class MySelect extends React.PureComponent<MySelectProps> {

  render() {
    return (
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel>{this.props?.label}</InputLabel>
        <Select
          MenuProps={this.props?.className}
          value={this.props?.value}
          label={this.props?.label}
          style={{ width: '100%', zIndex: 3 }}
          variant={this.props?.variant ? this.props?.variant : 'outlined'}
          disabled={this.props?.disabled || this.props?.disabled === true ? true : false}
          onChange={this.props?.func as never}
          multiple={this.props?.multiple && this.props?.multiple === true ? true : false}
        >
          {this.props?.data?.map((item, key) => (
            <MenuItem key={key} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}
