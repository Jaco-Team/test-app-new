import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

//import ClearIcon from '@mui/icons-material/Clear';
//import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
//const filter = createFilterOptions();

export default function MyAutocomplete({
  data,
  placeholder,
  onChange,
  val,
  func,
  variant,
  inputAdornment,
  matches,
  className,
  name,
  inputValue,
  onInputValueChange,
  onCommit,
}) {
  const [value, setValue] = useState(val);
  const controlledInput = onInputValueChange !== undefined;

  useEffect(() => {
    setValue(val);
  }, [val]);

  return (
    <Autocomplete
      inputValue={controlledInput ? inputValue : undefined}
      onInputChange={(event, value, reason) => {
        if (controlledInput) {
          if (reason === 'input' || reason === 'clear')
            onInputValueChange(value);
          return;
        }

        if (reason === 'reset') {
          func('');
        }

        if (reason === 'input') {
          func(value);
        }
      }}

      value={controlledInput ? inputValue || null : value}

      onChange={(event, newValue, reason) => {
        if (controlledInput) {
          if (newValue && typeof newValue === 'object' && !newValue.inputValue)
            onChange(newValue);
          else if (reason !== 'clear') onCommit?.();
          return;
        }
        if (typeof newValue === 'string') {
          setValue({
            name: newValue,
          });
          onChange(newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            name: newValue.inputValue,
          });
          onChange(newValue.inputValue);
        } else {
          setValue(newValue);
          onChange(newValue);
        }
      }}
      onBlur={(event, newValue) => {
        if (controlledInput) {
          if (event.target.tagName === 'INPUT') onCommit?.();
        } else onChange(event.target.value);
      }}

      onKeyDown={(event) => {
        if (
          controlledInput &&
          event.key === 'Enter' &&
          !event.target.getAttribute('aria-activedescendant')
        ) {
          event.preventDefault();
          event.defaultMuiPrevented = true;
          onCommit?.();
        }
      }}
      filterOptions={(x) => x}
      // clearIcon={matches ? false : <ClearIcon />}

      // filterOptions={(options, params) => {
      //   const filtered = filter(options, params);

      //   const { inputValue } = params;

      //   // Suggest the creation of a new value
      //   const isExisting = options.some((option) => inputValue === option.name);

      //   if (inputValue !== '' && !isExisting) {
      //     filtered.push({
      //       inputValue,
      //       name: inputValue,
      //     });
      //   }

      //   return filtered;
      // }}
      //selectOnFocus
      //clearOnBlur
      handleHomeEndKeys
      options={data}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      // renderOption={({ key, ...props }, option) => <li className='itemAutocomplited' {...props}>{option.name}</li>}

      renderOption={({ key, ...props }, option) => (
        <div
          key={key}
          className={matches ? 'autocompleteMobile' : 'autocompletePC'}
        >
          <li {...props}>
            <span>{option.name}</span>
            {option.title && option.title.length > 0 && (
              <span>{option.title}</span>
            )}
          </li>
        </div>
      )}

      freeSolo
      name={name ?? 'customField'}
      autoComplete={name ?? 'customField'}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant={variant}
          classes={className}
          name={name ?? 'customField'}
          autoComplete={name ?? 'customField'}
          InputProps={{
            ...params.InputProps,
            startAdornment: inputAdornment,
          }}
        />
      )}

      // PopperComponent={customPopper}
      // componentsProps={stylePaper}
    />
  );
}
