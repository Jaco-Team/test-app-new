import { useBodyScrollLock } from '@/src/shared/lib/overlay';
import type { ReactNode } from 'react';
import MuiModal from '@mui/material/Modal';
import { cn } from '../../foundation/classNames';
import { IconClose } from '../../icons';
import { IconButton } from '../IconButton/IconButton';
import './Modal.scss';

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';
export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: ModalSize;
  closeLabel?: string;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  closeLabel = 'Закрыть',
  className,
}: ModalProps) {
  useBodyScrollLock(open);

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby={title ? 'ui-modal-title' : undefined}
    >
      <div
        className={cn('ui-modal', 'ui-modal--size-' + size, className)}
        role="dialog"
        aria-modal="true"
      >
        <div className="ui-modal__header">
          {title ? (
            <h2 id="ui-modal-title" className="ui-modal__title">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <IconButton
            tone="neutral"
            size="sm"
            label={closeLabel}
            onClick={onClose}
          >
            <IconClose />
          </IconButton>
        </div>
        <div className="ui-modal__body">{children}</div>
      </div>
    </MuiModal>
  );
}
