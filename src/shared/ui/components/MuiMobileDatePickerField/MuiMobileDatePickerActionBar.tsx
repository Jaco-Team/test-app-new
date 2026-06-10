'use client';

import type { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { Button } from '../Button/Button';
import './MuiMobileDatePickerField.scss';

export function MuiMobileDatePickerActionBar({
  onAccept,
  onCancel,
  actions,
  className,
}: PickersActionBarProps) {
  return (
    <div
      className={
        className
          ? `ui-mui-mobile-date-picker__actions ${className}`
          : 'ui-mui-mobile-date-picker__actions'
      }
    >
      {actions?.includes('cancel') ? (
        <Button
          type="button"
          tone="neutral"
          size="sm"
          range="compact"
          className="ui-mui-mobile-date-picker__action-btn"
          onClick={onCancel}
        >
          Отмена
        </Button>
      ) : null}
      {actions?.includes('accept') ? (
        <Button
          type="button"
          tone="primary"
          size="sm"
          range="compact"
          className="ui-mui-mobile-date-picker__action-btn"
          onClick={onAccept}
        >
          Выбрать
        </Button>
      ) : null}
    </div>
  );
}
