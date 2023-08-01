import React from 'react';

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: '4.2vw',
  height: '2.1vw',
  borderRadius: '2vw',
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '0.1vw',
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(2.1vw)',
      color: '#fff',
      marginTop: '0.1vw',
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
    width: '1.9vw',
    height: '1.9vw',
  },
  '& .MuiSwitch-track': {
    borderRadius: 36 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const BasketSwitch = styled(Switch)(({ theme }) => ({
  width: '28.880866425993vw',
  height: '2.8880866425993vw',
  padding: 0,
  display: 'flex',
  borderRadius: '1.4440433212996vw',
  fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  fontSize: '1.0830324909747vw',
  fontWeight: 400,
  fontStyle: 'normal',

  '& .MuiButtonBase-root.MuiSwitch-switchBase': {
    padding: 0,
  },

  '& .MuiSwitch-switchBase.Mui-checked': {
    transform: 'translateX(14.440433212996vw)',
    padding: 0,
  },

  '& .MuiSwitch-switchBase': {
    transitionDuration: '300ms',
    '&.Mui-checked': {
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
      '& .MuiSwitch-thumb': {
        '&:after': {
          content: "'Самовывоз'",
          color: '#fff',
        },
      },
    },
  },

  '& .MuiSwitch-thumb': {
    width: '14.440433212996vw',
    background: '#DD1A32',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:after': {
      content: "'Доставка'",
      color: '#fff',
    },
    width: '14.440433212996vw',
    height: '2.8880866425993vw',
    borderRadius: '1.4440433212996vw',
  },

  '& .MuiSwitch-track': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: 'rgba(0, 0, 0, 0.80)',
    boxSizing: 'border-box',
    '&:after': {
      content: "'Самовывоз'",
    },
    '&:before': {
      content: "'Доставка'",
    },
  },
}));

export class SwitchIOS extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
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

export class SwitchBasket extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <BasketSwitch onClick={this.props.onClick} />
    );
  }
}
