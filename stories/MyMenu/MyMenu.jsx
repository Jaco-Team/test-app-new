import React from 'react';
import PropTypes from 'prop-types';
import './MyMenu.scss';

import Link from 'next/link';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';

export const MyMenu = ({ anchorEl, isOpen, onClose, list }) => {

  if( !anchorEl && isOpen === true ){
    return (
      <Paper className='MyMenuPaper'>
        <ul className='MyMenu'>
          {list.map( item => 
            <li key={item.link} onClick={onClose}>
              <Link href={item.link}>{item.title}</Link>
            </li>
          )}
        </ul>
      </Paper>
    );
  }

  return (
    <Menu 
      anchorEl={anchorEl} 
      open={isOpen} 
      onClose={ onClose } 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      transformOrigin={{ vertical: 'top',  horizontal: 'center' }} 
      autoFocus={false}
      className='MyMenu'
    >
      {list.map( item => 
        <li key={item.link} onClick={onClose}>
          <Link href={item.link}>{item.title}</Link>
        </li>
      )}
    </Menu>
  );
};

MyMenu.propTypes = {
  list: PropTypes.array,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  anchorEl: PropTypes.node,
};
