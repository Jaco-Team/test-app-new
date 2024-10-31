import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

//import ClearIcon from '@mui/icons-material/Clear';
//import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
//const filter = createFilterOptions();

export default function MyAutocomplete({data, placeholder, onChange, val, func , variant, inputAdornment, matches, className}) {
  const [value, setValue] = useState( val );

  useEffect( () => {
    setValue(val);
  }, [val] )

  return (
    <Autocomplete

      onInputChange={(event, value, reason) => {

        if(reason === 'reset') {
          func('');
        }

        if(reason === 'input') {
          func(value);
        }
      }}

      value={value}

      onChange={(event, newValue, reason) => {
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
          onChange(newValue.inputValue)
        } else {
          setValue(newValue);
          onChange(newValue)
        }
      }}
      onBlur={ (event, newValue) => {
        onChange(event.target.value)
      } }

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
      // renderOption={(props, option) => <li className='itemAutocomplited' {...props}>{option.name}</li>}

      renderOption={(props, option) =>
        <div className={matches ? 'autocompleteMobile' : 'autocompletePC'}>
          <li {...props}>
            <span>{option.name}</span>
            {option.title && option.title.length > 0 && <span>{option.title}</span>}
          </li>
        </div>
      }

      freeSolo
      
      renderInput={(params) => (
        <TextField {...params} 
          placeholder={placeholder} 
          variant={variant} 
          classes={className}
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
