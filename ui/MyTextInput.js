import React from 'react';
import TextField from '@mui/material/TextField';

import { IMaskInput } from 'react-imask';

const TextMaskCustom = React.forwardRef(
  function TextMaskCustom(props) {
    // const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...props}
        mask="# (000) 000-00-00"
        definitions={{
          '#': /[1-9]/,
        }}
        // inputRef={ref}
        // onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

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
          startAdornment: this.props.startAdornment,
          inputComponent: this.props.mask ? TextMaskCustom : null,
        }}
        defaultValue={this.props.defaultValue}
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
        style={{ width: '100%', zIndex: 3 }} 
        className={ this.props.className ? this.props.className : '' }
        name={this.props.name}
        autoComplete={this.props.autoComplete ? this.props.autoComplete : null}
      />
    )
  }
}
