import { useState, useEffect } from 'react';

import { useProfileStore } from '@/components/store';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { IconClose } from '@/ui/Icons';
import MyTextInput from '@/ui/MyTextInput';
import { roboto } from '@/ui/Font';

import { useSession } from 'next-auth/react';

const ans = [
  { id: 1, ans: 'Хочу отредактировать заказ' },
  { id: 2, ans: 'Изменились планы' },
  { id: 3, ans: 'Долгое время ожидания' },
  { id: 4, ans: 'Недостаточно средств' },
  { id: 5, ans: 'Просто отмените' },
  { id: 6, ans: 'Другое' },
];

export default function ModalOrderDelete() {
  const [openModalDelete, closeModalDel, orderDel] = useProfileStore( state => [ state.openModalDelete, state.closeModalDel, state.orderDel ])

  const [ chooseType, setChooseType ] = useState(0);
  const [ textDel, setTextDel ] = useState('');

  const session = useSession();

  useEffect( () => {
    setTextDel('');
    setChooseType(0);
  }, [openModalDelete] )

  return (
    <Dialog
      onClose={ closeModalDel }
      className={'modalOrderDelPC ' + roboto.variable}
      open={openModalDelete}
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      scroll="body"
    >
      <DialogContent style={{ padding: 0, borderRadius: '1.444045vw', overflow: 'hidden'}}>
        <div className="container">
          <IconButton style={{position: 'absolute', left: '-3.3vw', paddingTop: '0', backgroundColor: 'transparent'}} onClick={closeModalDel}>
            <IconClose style={{width: '2.1661vw', height: '2.1661vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)'}}/>
          </IconButton>

          <Grid container>
            <Grid item xs={12} className='header_status'>
              <Typography variant="h5" component="h1">Отменить заказ?</Typography>
            </Grid>
            <Grid item xs={12} className='header_text'>
              <Typography variant="h5" component="span">Вы можете отменить в любой момент.</Typography>
              <Typography variant="h5" component="span">Почему решили отменить сейчас?</Typography>
            </Grid>

            <Grid item xs={12} className='header_table'>
              { ans.map( (item, key) =>
                <div onClick={() => setChooseType(item.id)} className={chooseType == item.id ? 'active' : ''} key={key}>
                  <span>{item.ans}</span>
                </div>
              ) }
            </Grid>

            <Grid item xs={12} className='header_custom_text' style={{ visibility: chooseType == 6 ? 'visible' : 'hidden' }}>
              <MyTextInput variant="standard" value={textDel} func={ e => setTextDel(e.target.value) } />
            </Grid>

            <Grid item xs={12} className='header_btn'>
              <div onClick={ () => orderDel( 'zakazy', session.data?.user?.token, chooseType == 6 ? textDel : ans[ chooseType ]['ans'] ) }>
                <span>Отменить</span>
              </div>
                
              <div onClick={closeModalDel}>
                <span>Вернуться</span>
              </div>
            </Grid>

          </Grid>
        </div>
      </DialogContent>
    </Dialog>
  );
}
