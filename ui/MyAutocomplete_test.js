import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';

const filter = createFilterOptions();

export default function MyAutocomplete_test({data, placeholder, variant, inputAdornment, matches, func, setStreet, value}) {

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
        if (newValue && newValue?.name) {
          setStreet(newValue);
        } 
      }}
      
      onBlur={ (event, newValue) => {
        func('');
      }}

      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        
        const { inputValue } = params;

        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            name: inputValue,
          });
        }
        return filtered;
      }}

      handleHomeEndKeys
      options={data}

      clearIcon={matches ? false : <ClearIcon />}

      getOptionLabel={(option) => {


        if (typeof option === 'string') {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.name;
      }}

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
        <TextField 
          {...params} 
          placeholder={placeholder} 
          variant={variant} 
          InputProps={{
            ...params.InputProps,
            startAdornment: inputAdornment,
          }}
        />
      )}
    />
  );
}
