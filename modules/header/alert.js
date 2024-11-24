import { useEffect, useState } from 'react';

import { useHeaderStore } from '@/components/store.js';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';

export default function ModalAlert() {
  const [progress, setProgress] = useState(0);

  const [matches, openModalAlert, setActiveModalAlert, textAlert, statusAlert] = useHeaderStore((state) => [state?.matches, state?.openModalAlert, state?.setActiveModalAlert, state?.textAlert, state?.statusAlert]);

  useEffect(() => {

    if(openModalAlert) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 0;
          } else {
            const diff = Math.random() * 10;
            return Math.min(oldProgress + diff, 100);
          }
        });
      }, 400);
  
      return () => {
        clearInterval(timer);
      };

    } else {
      setProgress(0);
    }

  }, [openModalAlert]);

  useEffect(() => {

    if(!progress) {
      setActiveModalAlert(false, '', false);
    }

  }, [progress, setActiveModalAlert]);

  return (
    <Dialog 
      onClose={() => setActiveModalAlert(false, '', false)}
      className={matches ? 'modalAlertMobile ' + roboto.variable : 'modalAlertPC ' + roboto.variable}
      open={openModalAlert}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent style={{ backgroundColor: statusAlert ? 'rgb(46, 125, 50)' : '#dd1a32' }}>
        <IconButton onClick={() => setActiveModalAlert(false, '', false)}>
          <IconClose />
        </IconButton>
        <div className='containerAlert'>
          <span>{textAlert}</span>
          <LinearProgress variant="determinate" size="sm" value={progress} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
