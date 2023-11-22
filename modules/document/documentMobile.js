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
          <Link href={'/' + cityName + '/about'}>
            <div className="linkAboutMobile">
              <span>Кодекс этики</span>
              <ArrowRightMobile />
            </div>
          </Link>

          <Link href={'/' + cityName + '/publichnaya-oferta'}>
            <div className="linkAboutMobile">
              <span>Публичная оферта</span>
              <ArrowRightMobile />
            </div>
          </Link>

          <Link href={'/' + cityName + '/politika-konfidencialnosti'}>
            <div className="linkAboutMobile">
              <span>Политика конфиденциальности</span>
              <ArrowRightMobile />
            </div>
          </Link>

          <Link href={'/' + cityName + '/instpayorders'}>
            <div className="linkAboutMobile">
              <span>Правила оплаты</span>
              <ArrowRightMobile />
            </div>
          </Link>

          <Link href={links?.link_allergens ?? links} target="_blank">
            <div className="linkAboutMobile">
              <span>Калорийность, состав, БЖУ</span>
              <ArrowRightMobile />
            </div>
          </Link>
        </div>
      </div>
    </Grid>
  );
}
