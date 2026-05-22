import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

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

export default function ModalSamaraEntranceWorks_mobile({ city }) {
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
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={closeModal}
      onOpen={() => {}}
      id="modalSamaraEntranceWorksMobile"
      className={'modalSamaraEntranceWorksMobile ' + roboto.variable}
      disableSwipeToOpen
    >
      <div className="modalSamaraEntranceWorksSheet">
        <div className="modalSamaraEntranceWorksSheet__header">
          <div className="Line" />
          <IconButton
            className="closeButton"
            onClick={closeModal}
            aria-label="Закрыть"
          >
            <IconClose />
          </IconButton>
        </div>

        <div className="modalSamaraEntranceWorks">
          <div className="modalSamaraEntranceWorks__photo">
            <Image
              alt="Входная группа на Куйбышева на ремонте"
              src={SAMARA_ENTRANCE_WORKS_PHOTO}
              width={SAMARA_ENTRANCE_WORKS_PHOTO_WIDTH}
              height={SAMARA_ENTRANCE_WORKS_PHOTO_HEIGHT}
              priority
              sizes="92vw"
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
        </div>
      </div>
    </SwipeableDrawer>
  );
}
