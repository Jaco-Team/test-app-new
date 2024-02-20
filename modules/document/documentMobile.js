import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { ArrowRightMobile } from '@/ui/Icons.js';

import { useFooterStore } from '@/components/store.js';

export default function DocumentPageMobile({ cityName }) {

  const [links] = useFooterStore((state) => [state.links]);

  return (
    <Grid item className="pageDocumentMobile" sx={{ display: { xs: 'flex', md: 'flex', sm: 'none' } }}>
      <div className="containerDocumentMobile">
        <div className="listDocumentMobile">
          
          <Link href={'/' + cityName + '/about'}>
            <div className="linkDocumentMobile">
              <span>О компании</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/jobs'}>
            <div className="linkDocumentMobile">
              <span>Вакансии</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/publichnaya-oferta'}>
            <div className="linkDocumentMobile">
              <span>Публичная оферта</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/politika-konfidencialnosti'}>
            <div className="linkDocumentMobile">
              <span>Политика конфиденциальности</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/instpayorders'}>
            <div className="linkDocumentMobile">
              <span>Правила оплаты</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/legal'}>
            <div className="linkDocumentMobile">
              <span>Согласие на обработку персональных данных</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/politika-legal'}>
            <div className="linkDocumentMobile">
              <span>Политика в отношении обработки метрических данных</span>
              <ArrowRightMobile />
            </div>
          </Link>

          <Link href={links?.link_allergens ?? links} target="_blank">
            <div className="linkDocumentMobile">
              <span>Калорийность, состав, БЖУ</span>
              <ArrowRightMobile />
            </div>
          </Link>
          
        </div>
      </div>
    </Grid>
  );
}
