import React from 'react';

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const IOSSwitch = styled((props) => (<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />))(({ theme }) => ({
  width: '4.3322vw',
  height: '2.16606vw',
  borderRadius: '1.62454873vw',
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '0.180505415vw',
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(2.16606vw)',
      color: '#fff',
      marginTop: '0.180505415vw',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#57DC35',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    //paddingTop: '0.1vw',
    boxSizing: 'border-box',
    width: '1.80505415vw',
    height: '1.80505415vw',
  },
  '& .MuiSwitch-track': {
    borderRadius: 36 / 2,
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(221, 26, 50, 0.30)' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export default class MySwitch extends React.PureComponent {
  constructor(props) {
    super(props);
        
    this.state = {
      
    };
  }
  
  render(){
    return (
      <FormControlLabel 
        style={{ zIndex: 3 }}
        control={
          <IOSSwitch 
            checked={this.props.checked} 
            onClick={ this.props.onClick }
          />
        }
      />
    )
  }
}
