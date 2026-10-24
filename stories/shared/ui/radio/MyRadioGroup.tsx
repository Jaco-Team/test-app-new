import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useState } from 'react';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MyRadioGroupProps = {
  label?: string;
  options?: Option[];
  row?: boolean;
};

export default function MyRadioGroup({
  label = 'Способ получения кода',
  options = [],
  row = true,
}: MyRadioGroupProps) {
  const [value, setValue] = useState(options[0]?.value ?? '');

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        row={row}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio disabled={option.disabled} />}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
