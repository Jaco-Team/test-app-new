import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { DialogProps } from '@mui/material/Dialog';
import { useBodyScrollLock } from '@/src/shared/lib/overlay';
import { cn } from '../../foundation/classNames';
import { IconClose } from '../../icons';
import './ModalWrapper.scss';

export type ModalWrapperVariant = 'dialog' | 'bottom-sheet';

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
  useBodyScrollLock(open);

  const titleId = labelledBy ?? (title ? 'ui-modal-wrapper-title' : undefined);

  const handleClose: DialogProps['onClose'] = (_event, reason) => {
    if (!closeOnBackdrop && reason === 'backdropClick') {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={cn(
        'ui-modal-wrapper',
        `ui-modal-wrapper--${variant}`,
        className
      )}
      maxWidth={false}
      aria-labelledby={titleId}
      disableScrollLock
      slotProps={{
        container: {
          className: 'ui-modal-wrapper__container',
        },
        paper: {
          className: cn('ui-modal-wrapper__paper', paperClassName),
        },
        backdrop: {
          className: 'ui-modal-wrapper__backdrop',
        },
      }}
    >
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
      {title ? (
        <DialogTitle
          id={titleId}
          className={cn('ui-modal-wrapper__title', titleClassName)}
        >
          {title}
        </DialogTitle>
      ) : null}
      <DialogContent
        className={cn('ui-modal-wrapper__content', contentClassName)}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
