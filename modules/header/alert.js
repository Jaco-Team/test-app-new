import { useEffect, useState } from 'react';

import { useHeaderStoreNew } from '@/components/store.js';
import { BREAKPOINTS } from '@/utils/breakpoints';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';

export default function ModalAlert() {
  const [progress, setProgress] = useState(0);
  const isMobileAlert = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);

  const [openModalAlert, setActiveModalAlert, textAlert, statusAlert] = useHeaderStoreNew((state) => [state?.openModalAlert, state.setActiveModalAlert, state?.textAlert, state?.statusAlert]);

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
      className={isMobileAlert ? 'modalAlertMobile ' + roboto.variable : 'modalAlertPC ' + roboto.variable}
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
