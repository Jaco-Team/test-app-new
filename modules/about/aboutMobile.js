import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { ArrowRightMobile } from '@/ui/Icons.js';

export default function AboutPageMobile({ cityName }) {
  return (
    <Grid item className="pageAboutMobile" sx={{ display: { xs: 'flex', md: 'flex', sm: 'none' } }}>
      <div className="containerAboutMobile" style={{ marginBottom: '17.094017094017vw' }}>
        <div className="listAboutMobile">
          <Link href={'/' + cityName}>
            <div className="linkAboutMobile">
              <span>Что мы ценим?</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName}>
            <div className="linkAboutMobile">
              <span>Наши кафе</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName}>
            <div className="linkAboutMobile">
              <span>История компании</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/jobs'}>
            <div className="linkAboutMobile">
              <span>Вакансии</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/document'}>
            <div className="linkAboutMobile">
              <span>Документы</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName}>
            <div className="linkAboutMobile">
              <span>Социальная ответственность</span>
              <ArrowRightMobile />
            </div>
          </Link>
        </div>
      </div>
    </Grid>
  );
}
