import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export default function MyRadioGroup({
  label,
  value,
  onChange,
  options = [],
  className = '',
  row = false,
  name,
  disabled = false,
}) {
  return (
    <FormControl component="fieldset" className={className} fullWidth>
      {label ? <FormLabel component="legend">{label}</FormLabel> : null}
      <RadioGroup row={row} name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio disabled={disabled || option.disabled} />}
            label={option.label}
            disabled={disabled || option.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
