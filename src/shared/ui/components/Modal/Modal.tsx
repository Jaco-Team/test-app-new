import type { ReactNode } from 'react';
import MuiModal from '@mui/material/Modal';
import { cn } from '../../foundation/classNames';
import { Button } from '../Button/Button';
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
        {' '}
        <div className="ui-modal__header">
          {title ? (
            <h2 id="ui-modal-title" className="ui-modal__title">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <Button tone="neutral" size="sm" density="compact" onClick={onClose}>
            {closeLabel}
          </Button>
        </div>
        <div className="ui-modal__body">{children}</div>
      </div>
    </MuiModal>
  );
}
