import React from 'react';

import dynamic from 'next/dynamic';

import { shallow } from 'zustand/shallow'
import { useHomeStore } from '@/components/store';

const Start = dynamic(() => import('./start'));
const Set = dynamic(() => import('./set'));
const Value = dynamic(() => import('./value'));

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '@/ui/Font';

import Slide from '@mui/material/Slide';

import useMediaQuery from '@mui/material/useMediaQuery';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props}/>;
});

export default function ModalCardItem() {
  
  console.log('render ModalCardItem');
  
  const [isOpenModal, closeModal, typeModal] = useHomeStore( state => [state.isOpenModal, state.closeModal, state.typeModal], shallow );
  
  const matches = useMediaQuery('screen and (min-width: 40em)', { noSsr: true });

  return (
    <Dialog
      fullScreen={!matches}
      TransitionComponent={Transition}
      TransitionProps={{ timeout: matches ? 0 : 300}}
      onClose={closeModal}
      className={'modalOpenItem ' + roboto.variable}
      open={isOpenModal}
      BackdropComponent={Backdrop}
      BackdropProps={{timeout: 500}}
    >
      <DialogContent style={{ overflow: 'hidden', padding: 0, background: typeModal === 'start' ? '#FFFFFF' : '#E6E6E6', borderRadius: '40px', display: 'flex' }}>
        {typeModal === 'start' ?  <Start /> : null}
        {typeModal === 'set' ?  <Set /> : null}
        {typeModal === 'value' ?  <Value /> : null}
      </DialogContent>
    </Dialog>
  );
}
