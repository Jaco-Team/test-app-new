'use client';

import { Button, ModalWrapper, MuiTextField } from '@src/shared/ui';

type CartCommentModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function CartCommentModal({
  open,
  onClose,
  title,
  placeholder,
  value,
  onChange,
}: CartCommentModalProps) {
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
      <div className="cart-page__comment-modal">
        <MuiTextField
          id="cart-comment-modal"
          name="commentModal"
          className="cart-page__comment-input"
          range="compact"
          surface="outlined"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button
          className="cart-page__comment-done"
          tone="primary"
          size="lg"
          range="compact"
          fullWidth
          onClick={onClose}
        >
          Готово
        </Button>
      </div>
    </ModalWrapper>
  );
}
