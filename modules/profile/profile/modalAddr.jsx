import React, { useEffect, useState, useRef } from 'react';

import Grid from '@mui/material/Grid';

import { useForm, Controller } from "react-hook-form";

import ProfileBreadcrumbs from '../profileBreadcrumbs.jsx';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import MySwitch from '@/../ui/Switch.js';
import MySelect from '@/../ui/MySelect.js';

import { CloseIconMin } from '@/../ui/Icons.js';

import Meta from '@/components/meta.js';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { roboto } from '@/ui/Font.js';
import { IconClose, PencilModalAddrIcon, HomeModalAddrIcon } from '@/ui/Icons.js';
import MyTextInput from '@/ui/MyTextInput';
import MyAutocomplete from '@/ui/MyAutocomplete';


import { useProfileStore } from '@/../components/store.js';

import { useSession, signOut } from 'next-auth/react';

const data1 = [
  {id: 1, name: 'Льва Яшина'},
  {id: 2, name: 'Улица Ворошилова'},
];

export default function ModalAddr(){
  //const { page, this_module, city } = props;

  const [ isOpenModalAddr, closeModalAddr, allStreets, checkStreet ] = useProfileStore( state => [ state.isOpenModalAddr, state.closeModalAddr, state.allStreets, state.checkStreet ] );

  const [ street, setStreet ] = useState('');
  const [ home, setHome ] = useState('');
  const [ pd, setPd ] = useState('');
  const [ domophome, setDomophome ] = useState('');
  const [ et, setEt ] = useState('');
  const [ kv, setKv ] = useState('');
  const [ comment, setComment ] = useState('');

  

  useEffect(() => {
    if( street && street.length > 0 && home.length > 0 ){
      console.log( street, home )
      checkStreet(street, home)
    }
  }, [street, home]);

  return (
    <Dialog
      onClose={closeModalAddr}
      className={'modalAddrPC ' + roboto.variable}
      open={isOpenModalAddr}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <DialogContent>
        <div className="container">
          <IconButton style={{position: 'absolute', left: '-3.3vw', paddingTop: '0', backgroundColor: 'transparent'}} onClick={closeModalAddr}>
            <IconClose style={{width: '2.1661vw', height: '2.1661vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)'}}/>
          </IconButton>

          <div className='mainGrid'>
            <div className='map' id='map' />
            <div className='form'>

              <div className='nameAddr'>
                <span>Новый адрес</span>
                <PencilModalAddrIcon />
              </div>
              <div className='city'>
                <MyTextInput variant="standard" value={'Тольятти'} />
              </div>
              <div className='street'>
                <MyAutocomplete placeholder={'Улица'} data={allStreets} onChange={ val => setStreet(val) } />
              </div>
              <div className='street_dop_3'>
                <MyTextInput variant="standard" value={home} placeholder={'Дом'} func={ e => setHome(e.target.value) } />
                <MyTextInput variant="standard" value={pd} placeholder={'Подъезд'} func={ e => setPd(e.target.value) } />
                <MyTextInput variant="standard" value={domophome} placeholder={'Домофон'} func={ e => setDomophome(e.target.value) } />
              </div>
              <div className='street_dop_2'>
                <MyTextInput variant="standard" value={et} placeholder={'Этаж'} func={ e => setEt(e.target.value) } />
                <MyTextInput variant="standard" value={kv} placeholder={'Квартира'} func={ e => setKv(e.target.value) } />
              </div>
              <div className='comment'>
                <MyTextInput variant="standard" value={comment} placeholder={'Комментарий курьеру'} func={ e => setComment(e.target.value) } />
              </div>
              <div className='chooseMain'>
                <div>
                  <span>Сделать главным</span>
                  <div>
                    <HomeModalAddrIcon />
                  </div>
                </div>
                <MySwitch />
              </div>
              <div className='btnSave'>
                <div>
                  <span>Сохранить</span>
                </div>
              </div>
            </div>

            
          </div>

          
        </div>
      </DialogContent>
    </Dialog>
  )
}