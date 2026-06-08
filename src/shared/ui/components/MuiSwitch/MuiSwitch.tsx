'use client';

import MuiBaseSwitch, {
  type SwitchProps as MuiBaseSwitchProps,
} from '@mui/material/Switch';
import { cn } from '../../foundation/classNames';
import type { MuiControlRange } from '../internal/muiControl/shared';
import './MuiSwitch.scss';

export type MuiSwitchSize = 'default' | 'profile';
export type MuiSwitchTone = 'brand' | 'neutral';

export type MuiSwitchProps = MuiBaseSwitchProps & {
  range?: MuiControlRange;
  size?: MuiSwitchSize;
  tone?: MuiSwitchTone;
};

export function MuiSwitch({
  range = 'responsive',
  size = 'default',
  tone = 'brand',
  className,
  disableRipple = true,
  ...props
}: MuiSwitchProps) {
  return (
    <MuiBaseSwitch
      {...props}
      disableRipple={disableRipple}
      className={cn(
        'ui-mui-switch',
        'ui-mui-switch--range-' + range,
        'ui-mui-switch--size-' + size,
        'ui-mui-switch--tone-' + tone,
        className
      )}
    />
  );
}
