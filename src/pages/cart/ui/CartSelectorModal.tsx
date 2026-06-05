'use client';

import type { ReactNode } from 'react';
import { ModalWrapper } from '@src/shared/ui';

export type CartSelectorOption = {
  value: string;
  label: ReactNode;
  note?: ReactNode;
  disabled?: boolean;
};

type CartSelectorModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  options: CartSelectorOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

export function CartSelectorModal({
  open,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: CartSelectorModalProps) {
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={title}
      variant="responsive"
      className="cart-page__sheet-modal"
      paperClassName="cart-page__selector-modal"
      titleClassName="cart-page__selector-modal-title"
      contentClassName="cart-page__selector-modal-content"
    >
      <div className="cart-page__selector-list">
        {options.map((option) => (
          <button
            key={option.value}
            className={
              'cart-page__selector-item' +
              (option.value === selectedValue
                ? ' cart-page__selector-item--active'
                : '')
            }
            type="button"
            disabled={option.disabled}
            onClick={() => {
              if (option.disabled) {
                return;
              }

              onSelect(option.value);
              onClose();
            }}
          >
            <span className="cart-page__selector-item-copy">
              <span className="cart-page__selector-item-label">
                {option.label}
              </span>
              {option.note ? (
                <span className="cart-page__selector-item-note">
                  {option.note}
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
}
