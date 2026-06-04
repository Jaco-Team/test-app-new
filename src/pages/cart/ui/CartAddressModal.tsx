'use client';

import { useRouter } from 'next/navigation';
import { type SavedAddress } from '../model/useCartCheckoutDraft';
import { legacyCityPath } from '@src/shared/lib/sitePaths';
import { Button, ModalWrapper } from '@src/shared/ui';

type CartAddressModalProps = {
  open: boolean;
  onClose: () => void;
  citySlug: string;
  addresses: SavedAddress[];
  selectedAddressId: string;
  loading: boolean;
  onSelect: (value: string) => void;
};

function addressPrimaryText(address: SavedAddress): string {
  return address.title || address.name || address.label;
}

export function CartAddressModal({
  open,
  onClose,
  citySlug,
  addresses,
  selectedAddressId,
  loading,
  onSelect,
}: CartAddressModalProps) {
  const router = useRouter();

  function handleSelect(value: string) {
    onSelect(value);
    onClose();
  }

  function handleAddAddress() {
    onClose();
    router.push(legacyCityPath(citySlug, 'address'));
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Выберите адрес"
      variant="responsive"
      className="cart-page__sheet-modal"
      paperClassName="cart-page__selector-modal"
      titleClassName="cart-page__selector-modal-title"
      contentClassName="cart-page__selector-modal-content"
    >
      <div className="cart-page__address-modal">
        <div className="cart-page__address-list">
          {loading ? (
            <p className="cart-page__address-empty">Загружаем адреса...</p>
          ) : addresses.length ? (
            addresses.map((address) => (
              <button
                key={address.id}
                className={
                  'cart-page__address-item' +
                  (address.id === selectedAddressId
                    ? ' cart-page__address-item--active'
                    : '')
                }
                type="button"
                onClick={() => handleSelect(address.id)}
              >
                <span className="cart-page__address-item-head">
                  <span className="cart-page__address-item-title">
                    {addressPrimaryText(address)}
                  </span>
                  {address.isMain ? (
                    <span className="cart-page__address-item-badge">Дом</span>
                  ) : null}
                </span>
                {address.title && address.name ? (
                  <span className="cart-page__address-item-subtitle">
                    {address.name}
                  </span>
                ) : null}
                {address.note ? (
                  <span className="cart-page__address-item-note">
                    {address.note}
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <p className="cart-page__address-empty">
              Сохраненных адресов пока нет.
            </p>
          )}
        </div>
        <Button
          className="cart-page__address-add"
          tone="primary"
          size="lg"
          range="compact"
          fullWidth
          onClick={handleAddAddress}
        >
          Добавить новый
        </Button>
      </div>
    </ModalWrapper>
  );
}
