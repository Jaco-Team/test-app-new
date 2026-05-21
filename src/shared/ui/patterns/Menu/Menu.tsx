import type { ReactNode } from 'react';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
export type MenuOption = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
};
export type MenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  options: MenuOption[];
};
export function Menu({ anchorEl, open, onClose, options }: MenuProps) {
  return (
    <MuiMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      {options.map((option) => (
        <MenuItem
          key={option.id}
          disabled={option.disabled}
          onClick={() => {
            option.onSelect?.();
            onClose();
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </MuiMenu>
  );
}
