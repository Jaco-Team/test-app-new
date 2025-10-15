import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { ArrowRightMobile } from '@/ui/Icons.js';

import { useFooterStore, useCitiesStore } from '@/components/store.js';

export default function DocumentPageMobile({ cityName }) {

  const [links] = useFooterStore((state) => [state.links]);
  const [ thisCityRu ] = useCitiesStore( state => [ state.thisCityRu ] );

  const goToPage = (page) => {
    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'Клик в шапке '+page);
    }

    if( thisCityRu == 'Тольятти' ){
      ym(100601350, 'reachGoal', 'Клик в шапке '+page);
    }
  }

  const handleClick = () => {
    if(thisCityRu == 'Самара'){
      ym(100325084, 'reachGoal', 'health_reminder')
    }

    if(thisCityRu == 'Тольятти'){
      ym(100601350, 'reachGoal', 'health_reminder')
    }
  };

  return (
    <Grid item className="pageDocumentMobile" sx={{ display: { xs: 'flex', md: 'flex', sm: 'none' } }}>
      <div className="containerDocumentMobile">
        <div className="listDocumentMobile">
          
          <Link href={'/' + cityName + '/about'} onClick={ () => goToPage('О компании') }>
            <div className="linkDocumentMobile">
              <span>О компании</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/jobs'} onClick={ () => goToPage('Вакансии') }>
            <div className="linkDocumentMobile">
              <span>Вакансии</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/publichnaya-oferta'} onClick={ () => goToPage('Публичная оферта') }>
            <div className="linkDocumentMobile">
              <span>Публичная оферта</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/politika-konfidencialnosti'} onClick={ () => goToPage('Политика') }>
            <div className="linkDocumentMobile">
              <span>Политика конфиденциальности</span>
              <ArrowRightMobile />
            </div>
          </Link>
          <Link href={'/' + cityName + '/instpayorders'} onClick={ () => goToPage('Правила оплаты') }>
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

          <Link href={links?.link_allergens ?? links} target="_blank" onClick={ () => goToPage('Пищевая ценность') }>
            <div className="linkDocumentMobile">
              <span>Калорийность, состав, БЖУ</span>
              <ArrowRightMobile />
            </div>
          </Link>

          <Link href={'https://storage.yandexcloud.net/site-other-data/jaco.pdf'} target="_blank" onClick={handleClick}>
            <div className="linkDocumentMobile">
              <span>Памятка по сохранению здоровья</span>
              <ArrowRightMobile />
            </div>
          </Link>
          
        </div>
      </div>
    </Grid>
  );
}
