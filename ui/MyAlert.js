import React from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default class MyAlert extends React.Component {

  constructor(props) {
    super(props);
  }

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
          severity={ this.props.action ? "success" : "error" } 
          sx={{ width: '100%' }}
        >
          { this.props.action ? this.props.text ? this.props.text : 'Данные успешно сохранены!' : this.props.text } 
        </Alert>
      </Snackbar>
    )
  }
}
  