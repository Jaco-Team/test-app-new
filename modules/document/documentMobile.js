import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { ArrowRightMobile } from '@/ui/Icons.js';

import { useFooterStore } from '@/components/store.js';

export default function DocumentPageMobile({ cityName }) {

  const [links] = useFooterStore((state) => [state.links]);

  return (
    <Grid item className="pageAboutMobile" sx={{ display: { xs: 'flex', md: 'flex', sm: 'none' } }}>
      <div className="containerAboutMobile" style={{ marginBottom: '30.769230769231vw' }}>
        <div className="listAboutMobile">
          

          

          

          
        </div>
      </div>
    </Grid>
  );
}
