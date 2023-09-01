import Popper from '@mui/material/Popper';

export default function MyPopper(props) {
  return (
    <Popper
      {...props}
      placement="bottom-start"
      sx={{
        //boxShadow: 'none',
        '& .MuiAutocomplete-listbox': {
          "& .MuiAutocomplete-option[aria-selected='false']": {
            height: '8.5470085470085vw',
          },
          "& .MuiAutocomplete-option[aria-selected='true']": {
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            height: '8.5470085470085vw',
            '&.Mui-focused': {
              bgcolor: 'rgba(0, 0, 0, 0.05)',
              height: '8.5470085470085vw',
            },
          },
        },
        '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
          bgcolor: 'rgba(0, 0, 0, 0.05)',
          height: '8.5470085470085vw',
        },
      }}
    />
  );
}
