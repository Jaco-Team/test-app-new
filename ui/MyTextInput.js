import React from 'react';
import TextField from '@mui/material/TextField';

export default class MyTextInput extends React.PureComponent {
  constructor(props) {
    super(props);
        
    this.state = {
      type: 'text'
    };
  }
  
  render(){
    return (
      <TextField 
        InputProps={{
          readOnly: this.props.readOnly ? this.props.readOnly : false,
          endAdornment: this.props.inputAdornment,
        }}
        label={this.props.label}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChange={this.props.func}
        onBlur={this.props.onBlur ? this.props.onBlur : null}
        onKeyDown={this.props.onKeyDown ? this.props.onKeyDown : null}
        disabled={ this.props.disabled || this.props.disabled === true ? true : false }
        variant={ this.props.variant ? this.props.variant : "outlined"  }
        size={'small'} 
        color='primary'
        multiline={this.props.multiline ? this.props.multiline : false}
        maxRows={this.props.maxRows ? this.props.maxRows : 1}
        type={ this.props.type ? this.props.type : this.state.type }
        style={{ width: '100%' }} 
        className={ this.props.className ? this.props.className : '' }
      />
    )
  }
}
