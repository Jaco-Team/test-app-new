'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import {
  Button,
  ModalWrapper,
  MuiAutocompleteField,
  MuiSelectField,
  MuiSwitch,
  MuiTextField,
} from '@src/shared/ui';
import { HomeModalAddrIcon, PencilModalAddrIcon } from '@src/shared/ui/icons';
import { useHeaderStore } from '@src/entities/header';
import {
  clearAddressPickerIntent,
  readAddressPickerIntent,
} from '../model/addressPickerFlow';
import { useAddressPickerStore } from '../model/addressPickerStore';
import {
  formatAddressPickerSuggestion,
  toAddressPickerSuggestionOptions,
} from '../model/suggestionOptions';
import type { AddressPickerSuggestionOption } from '../model/types';
import { AddressPickerMap } from './AddressPickerMap';
import './AddressPickerModal.scss';

export function AddressPickerModal() {
  const router = useRouter();
  const token = useHeaderStore((state) => state.token);
  const {
    open,
    loading,
    submitting,
    errorText,
    source,
    mode,
    cityOptions,
    activeCityId,
    zones,
    mapCenter,
    mapPoint,
    mapZoom,
    mapResolving,
    query,
    suggestions,
    selectedAddress,
    resolvedCandidates,
    draft,
    closeAddressPicker,
    setDraftField,
    setQuery,
    fetchSuggestions,
    selectSuggestion,
    selectResolvedAddress,
    pickAddressFromMap,
    changeCity,
    submit,
    clearFeedback,
  } = useAddressPickerStore(
    useShallow((state) => ({
      open: state.open,
      loading: state.loading,
      submitting: state.submitting,
      errorText: state.errorText,
      source: state.source,
      mode: state.mode,
      cityOptions: state.cityOptions,
      activeCityId: state.activeCityId,
      zones: state.zones,
      mapCenter: state.mapCenter,
      mapPoint: state.mapPoint,
      mapZoom: state.mapZoom,
      mapResolving: state.mapResolving,
      query: state.query,
      suggestions: state.suggestions,
      selectedAddress: state.selectedAddress,
      resolvedCandidates: state.resolvedCandidates,
      draft: state.draft,
      closeAddressPicker: state.closeAddressPicker,
      setDraftField: state.setDraftField,
      setQuery: state.setQuery,
      fetchSuggestions: state.fetchSuggestions,
      selectSuggestion: state.selectSuggestion,
      selectResolvedAddress: state.selectResolvedAddress,
      pickAddressFromMap: state.pickAddressFromMap,
      changeCity: state.changeCity,
      submit: state.submit,
      clearFeedback: state.clearFeedback,
    }))
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const normalized = query.trim();
    if (normalized.length < 3) {
      return;
    }

    const timer = window.setTimeout(() => {
      void fetchSuggestions(normalized);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [fetchSuggestions, open, query]);

  const suggestionOptions = useMemo(
    () => toAddressPickerSuggestionOptions(suggestions),
    [suggestions]
  );

  const handleSubmit = useCallback(async () => {
    const success = await submit(token);
    if (!success) {
      return;
    }

    const intent = readAddressPickerIntent();
    if (source === 'cart' && intent?.returnTo) {
      clearAddressPickerIntent();
      router.push(intent.returnTo);
      return;
    }

    clearAddressPickerIntent();
  }, [router, source, submit, token]);

  const handleCancel = useCallback(() => {
    clearFeedback();
    closeAddressPicker();
  }, [clearFeedback, closeAddressPicker]);

  return (
    <ModalWrapper
      open={open}
      onClose={closeAddressPicker}
      title={mode === 'edit' ? 'Изменить адрес' : 'Добавить адрес'}
      variant="responsive"
      className="address-picker-modal"
      paperClassName="address-picker-modal__paper"
      titleClassName="address-picker-modal__title"
      contentClassName="address-picker-modal__content"
    >
      <div className="address-picker-modal__body">
        <div className="address-picker-modal__grid">
          <section className="address-picker-modal__map-panel">
            {/*<div className="address-picker-modal__map-head">
              <div>
                 <p className="address-picker-modal__eyebrow">Точка доставки</p> 
                <h3 className="address-picker-modal__section-title">
                  Выберите дом на карте
                </h3>
              </div>
              <p className="address-picker-modal__map-hint">
                Нажмите на карту или выберите адрес строкой поиска.
              </p>
            </div>*/}

            <AddressPickerMap
              open={open}
              center={mapCenter}
              point={mapPoint}
              zoom={mapZoom}
              zones={zones}
              disabled={loading || submitting}
              onPick={pickAddressFromMap}
            />

            {/* {selectedAddress ? (
              <div className="address-picker-modal__selected">
                <span className="address-picker-modal__selected-label">
                  Выбранный адрес
                </span>
                <span className="address-picker-modal__selected-value">
                  {selectedAddress.addressLine ||
                    [selectedAddress.district, selectedAddress.street]
                      .filter(Boolean)
                      .join(', ')}
                </span>
              </div>
            ) : (
              <div className="address-picker-modal__selected address-picker-modal__selected--muted">
                <span className="address-picker-modal__selected-label">
                  Адрес еще не выбран
                </span>
                <span className="address-picker-modal__selected-value">
                  Укажите дом через поиск или кликните по карте.
                </span>
              </div>
            )} */}
          </section>

          <div className="address-picker-modal__form">
            <div className="address-picker-modal__field-group address-picker-modal__field-group--name">
              <div
                className="address-picker-modal__leading-icon"
                aria-hidden="true"
              >
                <PencilModalAddrIcon />
              </div>
              <MuiTextField
                hiddenLabel
                placeholder="Название адреса"
                value={draft.name}
                onChange={(event) => setDraftField('name', event.target.value)}
                range="responsive"
                surface="outlined"
                slotProps={{
                  htmlInput: {
                    'aria-label': 'Название адреса',
                  },
                }}
              />
            </div>

            <div className="address-picker-modal__field-group">
              <p className="address-picker-modal__field-caption">Город</p>
              <MuiSelectField
                hiddenLabel
                aria-label="Город"
                value={activeCityId}
                options={cityOptions}
                range="responsive"
                surface="outlined"
                onChange={(event) =>
                  void changeCity(String(event.target.value))
                }
              />
            </div>

            <MuiAutocompleteField<
              AddressPickerSuggestionOption,
              false,
              false,
              false
            >
              options={suggestionOptions}
              value={null}
              inputValue={query}
              onInputChange={(_event, value, reason) => {
                if (reason === 'input' || reason === 'clear') {
                  setQuery(value);
                }
              }}
              onChange={(_event, value) => {
                if (value) {
                  void selectSuggestion(value);
                }
              }}
              getOptionKey={(option) => option.key}
              getOptionLabel={formatAddressPickerSuggestion}
              loading={loading}
              filterOptions={(options) => options}
              range="responsive"
              surface="outlined"
              placeholder="Улица и номер дома"
            />

            {resolvedCandidates.length > 1 ? (
              <div className="address-picker-modal__resolved">
                <p className="address-picker-modal__resolved-title">
                  Выберите точный адрес
                </p>
                <div className="address-picker-modal__resolved-list">
                  {resolvedCandidates.map((item) => (
                    <button
                      key={`${item.id}:${item.addressLine}`}
                      type="button"
                      className="address-picker-modal__resolved-item"
                      onClick={() => selectResolvedAddress(item)}
                    >
                      <span className="address-picker-modal__resolved-name">
                        {item.addressLine || item.street}
                      </span>
                      {item.cityName.length ? (
                        <span className="address-picker-modal__resolved-meta">
                          {item.cityName}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="address-picker-modal__row address-picker-modal__row--triple">
              <MuiTextField
                hiddenLabel
                placeholder="Подъезд"
                value={draft.pd}
                onChange={(event) => setDraftField('pd', event.target.value)}
                range="responsive"
                surface="outlined"
                slotProps={{
                  htmlInput: {
                    'aria-label': 'Подъезд',
                  },
                }}
              />
              <MuiTextField
                hiddenLabel
                placeholder="Этаж"
                value={draft.et}
                onChange={(event) => setDraftField('et', event.target.value)}
                range="responsive"
                surface="outlined"
                slotProps={{
                  htmlInput: {
                    'aria-label': 'Этаж',
                  },
                }}
              />
              <MuiTextField
                hiddenLabel
                placeholder="Квартира"
                value={draft.kv}
                onChange={(event) => setDraftField('kv', event.target.value)}
                range="responsive"
                surface="outlined"
                slotProps={{
                  htmlInput: {
                    'aria-label': 'Квартира',
                  },
                }}
              />
            </div>

            <MuiTextField
              hiddenLabel
              placeholder="Комментарий курьеру"
              value={draft.comment}
              onChange={(event) => setDraftField('comment', event.target.value)}
              range="responsive"
              surface="outlined"
              slotProps={{
                htmlInput: {
                  'aria-label': 'Комментарий курьеру',
                },
              }}
            />

            <div className="address-picker-modal__switches">
              <label className="address-picker-modal__switch-row">
                <span className="address-picker-modal__switch-copy">
                  <span>Домофон работает</span>
                </span>
                <MuiSwitch
                  checked={draft.domophome}
                  onChange={(event) =>
                    setDraftField('domophome', event.target.checked)
                  }
                />
              </label>
              <label className="address-picker-modal__switch-row">
                <span className="address-picker-modal__switch-copy">
                  <span>Сделать главным</span>
                  <span
                    className="address-picker-modal__switch-icon"
                    aria-hidden="true"
                  >
                    <HomeModalAddrIcon />
                  </span>
                </span>
                <MuiSwitch
                  checked={draft.isMain}
                  onChange={(event) =>
                    setDraftField('isMain', event.target.checked)
                  }
                />
              </label>
            </div>

            {errorText.length ? (
              <p className="address-picker-modal__error" role="alert">
                {errorText}
              </p>
            ) : null}
            {mapResolving ? (
              <p className="address-picker-modal__status" aria-live="polite">
                Определяем адрес по точке на карте...
              </p>
            ) : null}
            <div className="address-picker-modal__actions">
              <Button
                tone="neutral"
                size="lg"
                range="regular"
                onClick={handleCancel}
              >
                Отмена
              </Button>
              <Button
                tone="primary"
                size="lg"
                range="regular"
                onClick={() => void handleSubmit()}
                disabled={submitting || loading}
              >
                {submitting ? 'Сохраняем...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
