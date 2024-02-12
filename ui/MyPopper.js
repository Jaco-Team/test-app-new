import Popper from '@mui/material/Popper';

export default function MyPopper(props) {
  return (
    <Popper
      {...props}
      placement="bottom-start"
      sx={{
        // boxShadow: 'none',
        '& .MuiAutocomplete-listbox': {
          "& .MuiAutocomplete-option[aria-selected='false']": {
            height: '8.5470085470085vw',
            fontSize: '50px',
          },
          "& .MuiAutocomplete-option[aria-selected='true']": {
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            height: '8.5470085470085vw',
            fontSize: '50px',
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
        '& .MuiAutocomplete-listbox': {
          '& li': {
            fontSize: '3.4188034188034vw !important',
            fontWeight: 400,
            fontStyle: 'normal',
            padding: '5.1282051282051vw 3.4188034188034vw',
            color: 'rgba(0, 0, 0, 0.8)'
          }
        }
      }}
    />
  );
}
