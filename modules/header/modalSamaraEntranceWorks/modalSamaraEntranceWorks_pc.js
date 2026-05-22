import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';
import {
  SAMARA_ENTRANCE_WORKS_PHOTO,
  SAMARA_ENTRANCE_WORKS_PHOTO_HEIGHT,
  SAMARA_ENTRANCE_WORKS_PHOTO_WIDTH,
  SAMARA_ENTRANCE_WORKS_MODAL_TEXT,
  SAMARA_ENTRANCE_WORKS_MODAL_TITLE,
  markSamaraEntranceWorksModalShown,
  shouldShowSamaraEntranceWorksModal,
} from '@/utils/samaraEntranceWorksModal';

export default function ModalSamaraEntranceWorks_pc({ city }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldShowSamaraEntranceWorksModal(city)) {
      setOpen(true);
    }
  }, [city]);

  function closeModal() {
    markSamaraEntranceWorksModalShown();
    setOpen(false);
  }

  return (
    <Dialog
      onClose={closeModal}
      className={'modalVKPCMain modalSamaraEntranceWorksPC ' + roboto.variable}
      open={open}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <DialogContent>
        <Box component="div" className="modalCityPC_1 modalSamaraEntranceWorks">
          <IconButton className="closeButton" onClick={closeModal}>
            <IconClose />
          </IconButton>

          <div className="modalSamaraEntranceWorks__photo">
            <Image
              alt="Входная группа на Куйбышева на ремонте"
              src={SAMARA_ENTRANCE_WORKS_PHOTO}
              width={SAMARA_ENTRANCE_WORKS_PHOTO_WIDTH}
              height={SAMARA_ENTRANCE_WORKS_PHOTO_HEIGHT}
              priority
              sizes="(max-width: 991px) 90vw, 34vw"
            />
          </div>

          <div className="modalSamaraEntranceWorks__text">
            <Typography
              component="p"
              className="modalSamaraEntranceWorks__title"
            >
              {SAMARA_ENTRANCE_WORKS_MODAL_TITLE}
            </Typography>
            <Typography component="span">
              {SAMARA_ENTRANCE_WORKS_MODAL_TEXT}
            </Typography>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
