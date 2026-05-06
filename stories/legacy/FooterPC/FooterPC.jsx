import PropTypes from 'prop-types';
import Link from 'next/link';

import './FooterPC.scss';

import { FooterCookie } from '../FooterCookie/FooterCookie';
import { FooterArrowUp } from '../FooterArrowUp/FooterArrowUp';

import { NewVKIcon, OdnIcon, TGIcon } from '../Icons';
import Typography from '@mui/material/Typography';

export const FooterPC = ({ cookie, arrow, cityName, links, page }) => {
  return (
    <>
      <FooterArrowUp arrow={arrow} page={page} />
      {cookie ? false : <FooterCookie cityName={cityName} />}
      <footer className="footerPC" style={{ minHeight: cookie ? '36.101083032491vw' : '45.126353790614vw', marginTop: page === 'contacts' ? null : '1.8050541516245vw' }}>
        <div className="ContainerPCFooter">
          <div className="column">
            <Typography component="span">Жако</Typography>
            <Link href={'/' + cityName + '/about'}>О Компании</Link>
            <Link href={'/' + cityName + '/company-details'}>Реквизиты</Link>
            <Link href={'/' + cityName + '/contacts'}>Контакты</Link>
          </div>
          <div className="column">
            <Typography component="span">Документы</Typography>
            {Object.keys(links).length == 0 ? (
              false
            ) : (
              <Link href={links?.link_allergens ?? ''} target="_blank">
                Калорийность, состав, БЖУ
              </Link>
            )}
            <Link href={'/' + cityName + '/publichnaya-oferta'}>
              Публичная оферта
            </Link>
            <Link href={'/' + cityName + '/politika-konfidencialnosti'}>
              Политика конфиденциальности
            </Link>
            <Link href={'/' + cityName + '/legal'}>
              Согласие на обработку персональных данных
            </Link>
            <Link href={'/' + cityName + '/politika-legal'}>
              Политика в отношении обработки метрических данных
            </Link>
            <Link href={'/' + cityName + '/instpayorders'}>Правила оплаты</Link>
          </div>
          <div className="column">
            <Typography component="span">Работа в жако</Typography>
            <Link href={'/' + cityName + '/jobs'}>Вакансии</Link>
          </div>
          <div className="column">
            <Typography component="span">Франшиза</Typography>
            <Link href={'https://franchise.jacofood.ru'} target="_blank">
              Сайт франшизы
            </Link>
            <Link href={'https://invest.jacofood.ru'} target="_blank">
              Сайт для инвестиций
            </Link>
          </div>
          <div className="container">
            <div className="icon">
              {Object.keys(links).length == 0 ? (
                false
              ) : (
                <>
                  <Link href={links?.link_vk ?? ''} target="_blank">
                    <NewVKIcon />
                  </Link>
                  <Link href={links?.link_tg ?? ''} target="_blank">
                    <TGIcon />
                  </Link>
                  <Link href={links?.link_ok ?? ''} target="_blank" style={{ marginRight: 0 }}>
                    <OdnIcon />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="ContainerCopyFooter">
          <div className="copy">
            <Typography component="span" className="copy">
              {new Date().getFullYear()} © Жако
            </Typography>
          </div>
        </div>
      </footer>
    </>
  );
};

FooterPC.propTypes = {
  cookie: PropTypes.bool,
  arrow: PropTypes.bool,
  cityName: PropTypes.string.isRequired,
  links: PropTypes.object,
  page: PropTypes.string.isRequired,
};
