import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fade from '@mui/material/Fade';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { DialogProps } from '@mui/material/Dialog';
import type { Theme } from '@mui/material/styles';
import { BREAKPOINTS } from '../../foundation/breakpoints';
import { useBodyScrollLock } from '@/src/shared/lib/overlay';
import { cn } from '../../foundation/classNames';
import { IconClose } from '../../icons';
import './ModalWrapper.scss';

export type ModalWrapperVariant = 'dialog' | 'bottom-sheet' | 'responsive';

export type ModalWrapperProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  className?: string;
  paperClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  closeLabel?: string;
  closeOutside?: boolean;
  closeOnBackdrop?: boolean;
  labelledBy?: string;
  variant?: ModalWrapperVariant;
};

export function ModalWrapper({
  open,
  onClose,
  children,
  title,
  className,
  paperClassName,
  titleClassName,
  contentClassName,
  closeLabel = 'Закрыть',
  closeOutside = false,
  closeOnBackdrop = true,
  labelledBy,
  variant = 'dialog',
}: ModalWrapperProps) {
  const compact = useMediaQuery(
    (theme: Theme) => theme.breakpoints.down('sm'),
    {
      noSsr: true,
    }
  );
  const regular = useMediaQuery(
    '(min-width: ' +
      BREAKPOINTS.regularMin +
      'px) and (max-width: ' +
      BREAKPOINTS.regularMax +
      'px)',
    {
      noSsr: true,
    }
  );
  const responsive = variant === 'responsive';
  const sheet = responsive && compact;
  const dialogMode = regular ? 'regular-dialog' : 'expanded-dialog';

  useBodyScrollLock(open);

  const titleId = labelledBy ?? (title ? 'ui-modal-wrapper-title' : undefined);

  const handleDialogClose: DialogProps['onClose'] = (_event, reason) => {
    if (!closeOnBackdrop && reason === 'backdropClick') {
      return;
    }

    onClose();
  };

  const rootClassName = cn(
    'ui-modal-wrapper',
    'ui-modal-wrapper--' + variant,
    sheet && 'ui-modal-wrapper--sheet',
    !sheet && responsive && 'ui-modal-wrapper--responsive-dialog',
    !sheet && responsive && 'ui-modal-wrapper--' + dialogMode,
    className
  );
  const paperClass = cn('ui-modal-wrapper__paper', paperClassName);
  const titleNode = title ? (
    <DialogTitle
      id={titleId}
      className={cn('ui-modal-wrapper__title', titleClassName)}
    >
      {title}
    </DialogTitle>
  ) : null;
  const contentNode = (
    <DialogContent
      className={cn('ui-modal-wrapper__content', contentClassName)}
    >
      {children}
    </DialogContent>
  );
  const closeNode = (
    <button
      className={cn(
        'ui-modal-wrapper__close',
        closeOutside && 'ui-modal-wrapper__close--outside'
      )}
      type="button"
      aria-label={closeLabel}
      onClick={onClose}
    >
      <IconClose aria-hidden="true" />
    </button>
  );

  if (sheet) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onOpen={() => {}}
        onClose={closeOnBackdrop ? onClose : () => {}}
        className={rootClassName}
        aria-labelledby={titleId}
        disableSwipeToOpen
        disableDiscovery
        allowSwipeInChildren
        hysteresis={0.15}
        minFlingVelocity={250}
        disableBackdropTransition={false}
        transitionDuration={{ enter: 260, exit: 200 }}
        ModalProps={{
          disableScrollLock: true,
          keepMounted: false,
        }}
        slotProps={{
          backdrop: {
            className: 'ui-modal-wrapper__backdrop',
          },
          paper: {
            className: paperClass,
          },
        }}
      >
        <div className="ui-modal-wrapper__sheet">
          <div className="ui-modal-wrapper__sheet-header">
            <div className="ui-modal-wrapper__sheet-grip" aria-hidden="true" />
            {titleNode}
          </div>
          {contentNode}
        </div>
      </SwipeableDrawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      className={rootClassName}
      maxWidth="sm"
      fullWidth={responsive}
      aria-labelledby={titleId}
      disableScrollLock
      TransitionComponent={Fade}
      transitionDuration={{ enter: 180, exit: 150 }}
      slotProps={{
        container: {
          className: 'ui-modal-wrapper__container',
        },
        paper: {
          className: paperClass,
        },
        backdrop: {
          className: 'ui-modal-wrapper__backdrop',
        },
      }}
    >
      {closeNode}
      {titleNode}
      {contentNode}
    </Dialog>
  );
}
