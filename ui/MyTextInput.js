import React from 'react';
import TextField from '@mui/material/TextField';

import { IMaskInput } from 'react-imask';



const TextMaskCustomNew = React.forwardRef(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="8 (000) 000-00-00"
        
        inputRef={ref}
        onAccept={(value) => onChange({ target: { value } })}
        overwrite
      />
    );
  },
);

export function FormattedInputs(props) {
  return (
    <TextField 
        InputProps={{
          readOnly: props.readOnly ? props.readOnly : false,
          endAdornment: props.inputAdornment,
          startAdornment: props.startAdornment,
          inputComponent: props.mask ? TextMaskCustomNew : null,
        }}
        defaultValue={props.defaultValue}
        label={props.label}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.func}
        onBlur={props.onBlur ? props.onBlur : null}
        onKeyDown={props.onKeyDown ? props.onKeyDown : null}
        disabled={ props.disabled || props.disabled === true ? true : false }
        variant={ props.variant ? props.variant : "outlined"  }
        size={'small'} 
        color='primary'
        multiline={props.multiline ? props.multiline : false}
        maxRows={props.maxRows ? props.maxRows : 1}
        type={ props.type ? props.type : state.type }
        style={{ width: '100%', zIndex: 3 }} 
        className={ props.className ? props.className : '' }
        name={props.name}
        autoComplete={props.autoComplete ? props.autoComplete : null}
      />
  )
}

const TextMaskCustom = 
  function TextMaskCustom(props, event) {
    return (
      <IMaskInput
        {...props}
        mask="{8}(000)000-00-00"
        autoComplete={true}
        value={ props.value }
        // inputRef={ref}
        // onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }

export const MyTextMaskCustom = function TextMaskCustom(props) {
  console.log('props', props)  

  return (
    <IMaskInput
      {...props}
      mask="{8}(000)000-00-00"
      className={ props.className }
      value={ props.value }
      // inputRef={ref}
      // onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
}

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
        name={this.props?.name}
        id={this.props?.id}
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
        autoComplete={this.props.autoComplete ? this.props.autoComplete : null}
      />
    )
  }
}
