//import { useHeaderStore } from '@/components/store.js';
import Box from '@mui/material/Box';
//import Button from '@mui/material/Button';

export default function ProfileMobile() {
  //const [userName] = useHeaderStore((state) => [state.userName]);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className='ProfileMobile'>
      Привет я профиль!
    </Box>
  );
}
