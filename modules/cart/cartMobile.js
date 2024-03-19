import FormOrder from '@/modules/cartForm/formOrder';
import Box from '@mui/material/Box';

export default function CartMobile({ cityName }) {
  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="CartMobile">
      <FormOrder cityName={cityName} />
    </Box>
  );
}
