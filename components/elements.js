import React from 'react';

import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';

import TextField from '@mui/material/TextField';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { Roboto } from '@next/font/google'

export function IconRuble(props) {
  return (
    <svg
      style={ props.style }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1 0 24 24"
    >
      <path d="M17.778 7.449a3.628 3.628 0 00-1.107-2.761l-.001-.001a4.03 4.03 0 00-2.923-1.057h.009-5.454v7.636h5.454a4.032 4.032 0 002.917-1.06l-.003.003a3.633 3.633 0 001.108-2.768v.007zm4.04 0a7.11 7.11 0 01-2.158 5.368l-.002.002a7.65 7.65 0 01-5.581 2.08h.015-5.795v2.011H16.926c.29 0 .525.235.525.525v.022-.001 2.203c0 .29-.235.525-.525.525h-.022.001-8.608v3.291a.537.537 0 01-.537.528H4.886a.525.525 0 01-.525-.525v-.022.001-3.273H.522a.525.525 0 01-.525-.525v-.022.001-2.182-.021c0-.29.235-.525.525-.525h.022-.001 3.818v-2.011H.522a.525.525 0 01-.525-.525v-.022.001-2.54-.006a.537.537 0 01.528-.537h.019-.001 3.818V.55.529c0-.29.235-.525.525-.525h.022-.001 9.187a7.653 7.653 0 015.57 2.084l-.004-.004a7.11 7.11 0 012.157 5.378v-.013z"></path>
    </svg>
  );
}

export function VKIcon(props){
  return (
    <svg 
      style={ props.style }
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 448 512"
    >
      <path d="M31.4907 63.4907C0 94.9813 0 145.671 0 247.04V264.96C0 366.329 0 417.019 31.4907 448.509C62.9813 480 113.671 480 215.04 480H232.96C334.329 480 385.019 480 416.509 448.509C448 417.019 448 366.329 448 264.96V247.04C448 145.671 448 94.9813 416.509 63.4907C385.019 32 334.329 32 232.96 32H215.04C113.671 32 62.9813 32 31.4907 63.4907ZM75.6 168.267H126.747C128.427 253.76 166.133 289.973 196 297.44V168.267H244.16V242C273.653 238.827 304.64 205.227 315.093 168.267H363.253C359.313 187.435 351.46 205.583 340.186 221.579C328.913 237.574 314.461 251.071 297.733 261.227C316.41 270.499 332.907 283.63 346.132 299.751C359.357 315.873 369.01 334.618 374.453 354.747H321.44C316.555 337.262 306.614 321.61 292.865 309.754C279.117 297.899 262.173 290.368 244.16 288.107V354.747H238.373C136.267 354.747 78.0267 284.747 75.6 168.267Z"/>
    </svg>
  )
}

export function OdnIcon(props){
  return (
    <svg 
      style={ props.style }
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 448 512"
    >
      <path d="M184.2 177.1c0-22.1 17.9-40 39.8-40s39.8 17.9 39.8 40c0 22-17.9 39.8-39.8 39.8s-39.8-17.9-39.8-39.8zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-305.1 97.1c0 44.6 36.4 80.9 81.1 80.9s81.1-36.2 81.1-80.9c0-44.8-36.4-81.1-81.1-81.1s-81.1 36.2-81.1 81.1zm174.5 90.7c-4.6-9.1-17.3-16.8-34.1-3.6 0 0-22.7 18-59.3 18s-59.3-18-59.3-18c-16.8-13.2-29.5-5.5-34.1 3.6-7.9 16.1 1.1 23.7 21.4 37 17.3 11.1 41.2 15.2 56.6 16.8l-12.9 12.9c-18.2 18-35.5 35.5-47.7 47.7-17.6 17.6 10.7 45.8 28.4 28.6l47.7-47.9c18.2 18.2 35.7 35.7 47.7 47.9 17.6 17.2 46-10.7 28.6-28.6l-47.7-47.7-13-12.9c15.5-1.6 39.1-5.9 56.2-16.8 20.4-13.3 29.3-21 21.5-37z"/>
    </svg>
  )
}

export function TGIcon(props){
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 496 512"
      style={ props.style }
    >
      <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"/>
    </svg>
  )
}

export function IconInfoWhite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 80 80"
    >
      <circle cx="40" cy="40" r="39" stroke="#DADADA" strokeWidth="2"></circle>
      <path
        stroke="#DADADA"
        strokeLinecap="round"
        strokeWidth="4"
        d="M40 34L40 62"
      ></path>
      <circle cx="40" cy="22.667" r="4" fill="#DADADA"></circle>
    </svg>
  );
}

export function IconInfoBlack() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 80 80"
    >
      <circle cx="40" cy="40" r="40" fill="#000" fillOpacity="0.6"></circle>
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="4"
        d="M40 34L40 62"
      ></path>
      <circle cx="40" cy="22.666" r="4" fill="#fff"></circle>
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg
      style={ props.style ? props.style : null }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="3"
        d="M2 2l60 60M62 2L2 62"
      ></path>
    </svg>
  );
}

export function BurgerIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="23"
      fill="none"
      viewBox="0 0 30 23"
      {...props}
    >
      <path
        stroke="#B1B1B1"
        strokeLinecap="round"
        strokeWidth="3"
        d="M1.5 1.5L28.5 1.5"></path>
      <path
        stroke="#B1B1B1"
        strokeLinecap="round"
        strokeWidth="3"
        d="M1.5 11.5L28.5 11.5"></path>
      <path
        stroke="#B1B1B1"
        strokeLinecap="round"
        strokeWidth="3"
        d="M1.5 21.5L28.5 21.5"></path>
    </svg>
  );
}

export class MyTextInput extends React.PureComponent {
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

export class MyCheckBox extends React.PureComponent {
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

export class MySelect extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  render(){
    return (
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel>{this.props.label}</InputLabel>
        <Select
          value={this.props.value}
          label={this.props.label}
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export class MyAlert extends React.Component {
  render(){
    return (
      <Snackbar 
        open={this.props.isOpen} 
        autoHideDuration={5000}
        anchorOrigin={{  
          vertical: 'top',
          horizontal: 'center', 
        }}
        onClose={this.props.onClose}
      >
        <Alert 
          onClose={this.props.onClose} 
          severity={ this.props.status ? "success" : "error" } 
          sx={{ width: '100%' }}
        >
          { this.props.status ? this.props.text ? this.props.text : 'Данные успешно сохранены!' : this.props.text } 
        </Alert>
      </Snackbar>
    )
  }
}

export const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

export const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['sans-serif'],
  variable: '--inter-font',
})