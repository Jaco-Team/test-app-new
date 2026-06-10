'use client';

import MuiBaseSwitch, {
  type SwitchProps as MuiBaseSwitchProps,
} from '@mui/material/Switch';
import { cn } from '../../foundation/classNames';
import type { MuiControlRange } from '../internal/muiControl/shared';
import './MuiSwitch.scss';

export type MuiSwitchSize = 'default' | 'profile';
export type MuiSwitchTone = 'brand' | 'neutral';

export type MuiSwitchProps = Omit<MuiBaseSwitchProps, 'size' | 'color'> & {
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
      color="default"
      disableRipple={disableRipple}
      className={cn(
        'ui-mui-switch',
        'ui-mui-switch--range-' + range,
        size !== 'default' && 'ui-mui-switch--size-' + size,
        tone !== 'brand' && 'ui-mui-switch--tone-' + tone,
        className
      )}
    />
  );
}
